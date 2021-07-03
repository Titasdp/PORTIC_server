const NewsModel = require("../Models/News")
const sequelize = require("../Database/connection")

// Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")

//Controllers
const pictureController = require("../Controllers/pictureController")
const dataStatusController = require("../Controllers/dataStatusController")
//Models
const ProjectNewsModel = require("../Models/NewsProject");
const {
    Available_position
} = require("../Models/AvailablePosition");


// Env
require("dotenv").config();

/**
 * gets news ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_news FROM News", {
            model: NewsModel.News
        })
        .then(data => {
            respCode = 200;
            if (data.length === 0) {
                respCode = 204
            }
        })
        .catch(error => {
            console.log(error);
            respCode = 500
        });
    return respCode
};







const initNews = async (dataObj) => {
    let processResp = {}
    let confTableFilledEns = await confTableFilled()
    if (confTableFilledEns === 200) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: false,
                processError: null,
                processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
            }
        }
        return processResp
    } else if (confTableFilledEns === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                initSuccess: false,
                processError: null,
                processMsg: "Something went wrong, please try again later.",
            }
        }
        return processResp
    }

    if (dataObj.idCreator === null || dataObj.idDataStatus === null || dataObj.idEntity === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp
    }

    let imgsInitResult = await pictureController.initAddMultipleImgs({
        insertArray: [`/Images/NewsImagesGallery/labMister.jpg`, `/Images/NewsImagesGallery/labourTech.png`, `/Images/NewsImagesGallery/turismoNews.png`]
    })

    if (imgsInitResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                initSuccess: false,
                processError: null,
                processMsg: "Something went wrong, please try again later.",
            }
        }
        return processResp
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_News'), `P.PORTO realizou mais de 6500 testes à COVID-19`, `P.PORTO performed more than 6500 tests to COVID-19`, `Desde fins de maio que o laboratório licenciado de Análises Clínicas do P.PORTO já realizou 6500 testes à COVID-19, um número que cresceu significativamente a partir do momento em que se iniciou a colaboração do Politécnico do Porto com a Administração Regional de Saúde do Norte (ARS-Norte). No âmbito dessa cooperação foram realizados, desde outubro, 4600 testes protocolados à COVID-19. Os testes podem ser realizados no laboratório alocado no Porto Research, Technology & Innovation Center (PORTIC) do Politécnico do Porto, por indicação da ARS-Norte e do médico de família, ou recolhidas nas Áreas dedicadas a Doença Respiratória (ADR) dos Centros de Saúde, nas Áreas dedicadas à COVID-19 (ADC), e entregues no P.PORTO. “A partir do momento em que o laboratório molecular do Politécnico do Porto recebeu parecer favorável do Instituto Nacional de Saúde Doutor Ricardo Jorge | INSA para o diagnóstico SARS-CoV-2 integrado na Rede Nacional de Diagnóstico da COVID-19, fomos contatados, quase de imediato, pela ARS-Norte para apoiar os Centros de Saúde', explica Rúben Fernandes, investigador do PORTIC e coordenador do laboratório. 'De momento' - refere o investigador - ' abrangemos uma área regional que vai do Porto ocidental, zona de Aveiro Norte, São João da Madeira, Santa Maria da Feira, Vale de Cambra e Oliveira de Azeméis, apesar de já termos recebido e recolhido testes mais a sul.” A equipa é composta por 22 profissionais, entre investigadores, médicos e estudantes de licenciatura, mestrado e doutoramento da Escola Superior de Saúde do Politécnico do Porto que trabalham em regime de rotatividade, com turnos de seis horas. Há também uma equipa que faz deslocações, garantindo apoio a zonas fora da área de abrangência, tais como Setúbal ou Coimbra. Para além dos testes protocolados, 'estão a ser realizados testes à comunidade do Politécnico do Porto, a estudantes, à totalidade de estudantes Erasmus, a funcionários, docentes e ocasionalmente a familiares', garante Rúben Fernandes, sublinhando existir também serviços ao exterior a empresas e outros particulares. Num contexto severo de evolução significativa do número de casos, o investigador avalia uma percentagem diária de 30% de casos positivos, apesar de existir variáveis e oscilações. Recordamos que a região norte continua a ser a que regista mais casos e óbitos, com 2.284 novos casos e 50 óbitos só nas últimas 24 horas (dados de 24 de novembro). 'As medidas individuais continuam a ser a forma mais eficaz de ultrapassar este desafio, declara ainda em jeito de conclusão, só nós podemos colocar um travão a esta pandemia, respeitando as medidas de distanciamento social e as medidas individuais de higienização. Esta é a chave para parar esta pandemia.`, `Since the end of May, the licensed laboratory of Clinical Analysis of P.Porto has performed 6500 tests to COVID-19, a number that has grown significantly since the beginning of the collaboration between the Polytechnic of Porto and the Regional Health Administration of the North (ARS-Norte). In the scope of this cooperation, since October, 4600 tests were performed to COVID-19. The tests can be performed in the laboratory allocated in the Porto Research, Technology & Innovation Center (PORTIC) of the Polytechnic of Porto, by indication of the ARS-Norte and the family doctor, or collected in the Areas dedicated to Respiratory Disease (ADR) of the Health Centers, in the Areas dedicated to COVID-19 (ADC), and delivered to P.PORTO. "As soon as the molecular laboratory of the Polytechnic of Porto received a favorable opinion from the National Health Institute Doutor Ricardo Jorge | INSA for the SARS-CoV-2 diagnosis integrated in the National Diagnosis Network of COVID-19, we were contacted, almost immediately, by ARS-Norte to support the Health Centers", explains Rúben Fernandes, PORTIC researcher and coordinator of the laboratory. At the moment' - says the researcher - 'we cover a regional area that goes from western Porto, the Aveiro Norte area, São João da Madeira, Santa Maria da Feira, Vale de Cambra and Oliveira de Azeméis, although we have already received and collected tests further south. The team is made up of 22 professionals, including researchers, doctors and undergraduate, master's and doctoral students from the Escola Superior de Saúde do Politécnico do Porto who work on a rotating basis, with six-hour shifts. There is also a team that travels to ensure support to areas outside the area of coverage, such as Setúbal or Coimbra. Besides the protocoled tests, 'tests are being carried out for the Polytechnic of Porto community, students, all Erasmus students, employees, teachers and occasionally family members', guarantees Rúben Fernandes, stressing that there are also external services to companies and other individuals. In a severe context of significant evolution in the number of cases, the researcher evaluates a daily percentage of 30% of positive cases, although there are variables and oscillations. We recall that the northern region continues to be the one registering the most cases and deaths, with 2,284 new cases and 50 deaths in the last 24 hours alone (data from November 24th). Individual measures continue to be the most effective way to overcome this challenge," he concludes, "only we can put a stop to this pandemic by respecting the measures of social distancing and individual hygiene measures. This is the key to stopping this pandemic. Translated with www.DeepL.com/Translator (free version)`, `05-03-2021`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[0], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_News'), `Reconhecidos especialistas discutem o impacto da indústria 4.0`, `Renowned experts discuss the impact of Industry 4.0`, `O objectivo do evento é discutir e compreender o impacto das tecnologias do futuro no mercado de trabalho, com especial atenção ao papel da inovação e às perspetivas das organizações, dos empregados e da sociedade. Technological advances can bring many benefits for our society with significant impact in the way we communicate, work and live. These advances had led us to the fourth industrial revolution or Industry 4.0, where technologies, such as large-scale machine-to-machine communication (M2M), the internet of things (IoT), artificial intelligence (AI) and automation have disrupted the labour market, making us more efficient, more productive and more cost-efficient. But, would these advances make us more dispensable? Would they increase the control over employees’ performance? How will they affect the decision-making process of an organisation? Os avanços tecnológicos podem trazer muitos benefícios para a sociedade com um impacto significativo na forma como comunicamos, trabalhamos e vivemos. Estes avanços levaram-nos à quarta revolução industrial ou Indústria 4.0, onde tecnologias como a comunicação em grande escala, a Internet das coisas (IoT) e a inteligência artificial (IA) alteraram o mercado de trabalho, tornando-nos mais eficientes, mais produtivos e mais rentáveis. Mas, será que estes avanços tornam os trabalhadores mais dispensáveis? Aumentariam eles o controlo sobre o desempenho dos empregados? Como irão afetar o processo de tomada de decisão de uma organização? A conferência LABOURTECH 2021, aborda os impactos positivos e negativos das tecnologias do futuro no mercado de trabalho e o papel da inovação na Indústria 4.0. Além do mais serão apresentados os resultados adquiridos durante os 30 meses de execução do projeto HubIT. A conferência LABOURTECH 2021 irá juntar reconhecidos especialistas das mais diversas áreas de atuação. Qualquer pessoa pode participar com uma inscrição online aqui (gratuita). Os participantes terão a oportunidade de fazer perguntas durante a sessão e até mesmo de trabalhar em rede com outros participantes.`, `The objective of the event is to discuss and understand the impact of future technologies on the labor market, with special attention to the role of innovation and the perspectives of organizations, employees and society. Technological advances can bring many benefits for our society with significant impact in the way we communicate, work and live. These advances had led us to the fourth industrial revolution or Industry 4.0, where technologies, such as large-scale machine-to-machine communication (M2M), the internet of things (IoT), artificial intelligence (AI) and automation have disrupted the labor market, making us more efficient, more productive and more cost-efficient. But, would these advances make us more expendable? Would they increase the control over employees' performance? How will they affect the decision-making process of an organization? Technological advances can bring many benefits to society with a significant impact on the way we communicate, work and live. These advances have led us to the fourth industrial revolution or Industry 4.0, where technologies such as large-scale communication, the Internet of Things (IoT) and artificial intelligence (AI) have changed the labor market, making us more efficient, more productive and more profitable. But, do these advances make workers more expendable? Would they increase control over employee performance? How will they affect an organization's decision-making process? The LABOURTECH 2021 conference addresses the positive and negative impacts of future technologies on the labor market and the role of innovation in Industry 4.0. Furthermore, the results acquired during the 30 months of implementation of the HubIT project will be presented. The LABOURTECH 2021 conference will bring together recognized experts from various fields. Anyone can participate with an online registration here (free of charge). Participants will have the opportunity to ask questions during the session and even network with other participants.`, `05-03-2021`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[1], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_News'), `Programa Portugal Tourism Minds fecha a sua 1ª edição`, `Portugal Tourism Minds Program closes its 1st edition`, `O programa de aceleração Portugal Tourism Minds, promovido pela Startup Porto em parceria com o Turismo de Portugal, AHRESP, Turismo Porto e Norte de Portugal e Escola Superior de Hotelaria e Turismo do Porto, chegou ao fim da sua 1ª edição no passado dia 29 de Outubro com a apresentação dos empreendedores no evento Demo Day Virtual. Face à situação pandémica que assola o mundo inteiro, o evento teve lugar através de uma plataforma digital, contudo de nada desmoralizou a participação no Demo Day Virtual. Este contou com mais de 50 participantes de diversos setores do turismo, desde representantes do turismo de freguesias e concelhos do país, agentes de viagens, professores, investidores público e privados e empreendedores em busca de uma melhor resposta para a difícil situação que o turismo enfrenta. O Demo Day Virtual contou com uma apresentação Pitch das seguintes equipas participante no programa Portugal Tourism Minds: BestRide App, Personal2travel, Move4you, MakeitDouble e Saffe Payments. Para além dos pitch dos empreendedores, houve lugar a uma pequena apresentação por parte do Turismo de Portugal e da Portugal Ventures. No âmbito do programa Portugal Tourism Minds, a Startup Porto atribuiu um prémio MVP, para a melhor ideia, no valor de 2000€ à equipa BestRide App. A atribuição do prémio ficou a cargo de um júri constituído por elementos da Porto Global Hub, Turismo de Portugal e Portugal Ventures. O programa Portugal Tourism Minds foi criada para responder a desafios relacionados com o desenvolvimento sustentável do ecossistema de turismo em Portugal. Durante 4 meses os empreendedores contaram com apoio de especialistas das mais diversas áreas, de forma a sustentar um crescimento saudável da sua ideia/startup.`, `The acceleration program Portugal Tourism Minds, promoted by Startup Porto in partnership with Turismo de Portugal, AHRESP, Turismo Porto e Norte de Portugal and Escola Superior de Hotelaria e Turismo do Porto, reached the end of its 1st edition last October 29th with the presentation of the entrepreneurs in the event Virtual Demo Day. Given the pandemic situation that ravages the world, the event took place through a digital platform, however nothing demoralized the participation in the Virtual Demo Day. It was attended by more than 50 participants from various sectors of tourism, from tourism representatives from the country's parishes and municipalities, travel agents, teachers, public and private investors and entrepreneurs in search of a better response to the difficult situation facing tourism. The Virtual Demo Day included a Pitch presentation of the following teams participating in the Portugal Tourism Minds program: BestRide App, Personal2travel, Move4you, MakeitDouble and Saffe Payments. In addition to the entrepreneurs pitch, there was a short presentation by Turismo de Portugal and Portugal Ventures. Under the Portugal Tourism Minds program, Startup Porto awarded an MVP prize for the best idea, worth 2000€ to BestRide App team. The award was given by a jury composed by elements from Porto Global Hub, Turismo de Portugal and Portugal Ventures. The Portugal Tourism Minds program was created to respond to challenges related to the sustainable development of the tourism ecosystem in Portugal. For 4 months the entrepreneurs had the support of experts from various areas, in order to sustain a healthy growth of their idea/startup.`, `05-03-2021`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[2], dataObj.idDataStatus, dataObj.idCreator],
    ]
    await sequelize
        .query(
            `INSERT INTO News (id_news,title_pt,title_eng,description_pt,description_eng,published_date,id_entity,id_picture,id_status, id_publisher) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: NewsModel.News
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}


const fetchEntityNewsByIdEntity = async (dataObj) => {
    let processResp = {}

    if (!dataObj.req.sanitize(dataObj.req.params.lng) || !dataObj.req.params.id) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
            }
        }
        return processResp

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT News.id_news, News.title_pt as title, News.description_pt as description, News.published_date , Picture.img_path, User.full_name FROM((( News INNER JOIN 
        Picture on Picture.id_picture = News.id_picture) INNER JOIN 
        User on User.id_user = News.id_publisher) INNER JOIN  Data_Status on Data_Status.id_status = News.id_status )  
        where Data_Status.designation= 'Published' and News.id_entity=:id_entity and News.project_only = 0;` : `SELECT News.id_news, News.title_eng as title, News.description_eng as description, News.published_date , Picture.img_path, User.full_name FROM((( News INNER JOIN 
        Picture on Picture.id_picture = News.id_picture) INNER JOIN 
        User on User.id_user = News.id_publisher) INNER JOIN  Data_Status on Data_Status.id_status = News.id_status )  
        where Data_Status.designation= 'Published' and News.id_entity=:id_entity and News.project_only = 0;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: NewsModel.News
        })
        .then(async data => {
            let project = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let projectTags = await selectProjectNews(el.id_news, dataObj.req.sanitize(dataObj.req.params.lng))
                    // let cover = await fsPack.simplifyFileFetch(el.img_path)
                    let projectObj = {
                        id_news: el.id_news,
                        title: el.title,
                        initials: el.initials,
                        description: el.description,
                        published_date: el.published_date,
                        writer: el.full_name,
                        cover: process.env.API_URL + el.img_path,
                        project_tags: ((projectTags.processRespCode === 200) ? projectTags.toClient.processResult : []),
                    }
                    project.push(projectObj)

                }
            }


            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: project,
                    processError: null,
                    processMsg: respMsg,
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });

    return processResp
};

const selectProjectNews = async (id_news, lng) => {
    let processResp = {}
    let query = `SELECT Project.id_project, Project.initials FROM(((Project_news  inner Join 
        Project on Project.id_project= Project_news.id_project)
        Inner Join
        News on News.id_news = Project_news.id_news) INNER JOIN  Data_Status on Data_Status.id_status = Project.id_status)
         where News.id_news=:id_news and Data_Status.designation= 'Published'`
    await sequelize
        .query(query, {
            replacements: {
                id_news: id_news
            }
        }, {
            model: ProjectNewsModel.Project_news
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Admin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * Fetch News and related projects
 * StatusCompleted
 */

const fetchNewsByAdmin = async (dataObj) => {
    let query = (dataObj.user_level === `Super Admin`) ? `Select News.id_news,News.title_eng,News.title_pt, News.description_eng ,News.description_pt,News.published_date,News.project_only ,News.created_at, Picture.img_path as img, Entity.initials ,User.username, Data_Status.designation as data_status from  
    ((((News INNER JOIN Picture ON Picture.id_picture = News.id_picture) 
    INNER JOIN Entity on Entity.id_entity = News.id_entity) 
    INNER JOIN User ON User.id_user = News.id_publisher)
    INNER JOIN  Data_Status on Data_Status.id_status = News.id_status ) ;` : `Select News.id_news,News.title_eng,News.title_pt, News.description_eng ,News.description_pt,News.published_date,News.project_only ,News.created_at, Picture.img_path as img, Entity.initials ,User.username,  Data_Status.designation as data_status from  
    ((((News INNER JOIN Picture ON Picture.id_picture = News.id_picture) 
    INNER JOIN Entity on Entity.id_entity = News.id_entity)
    INNER JOIN  Data_Status on Data_Status.id_status = News.id_status ) 
    INNER JOIN User ON User.id_user = News.id_publisher) Where Entity.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: NewsModel.News
        })
        .then(async data => {
            let project = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let projectTags = await fetchNewsRelatedProject(el.id_news)
                    // let cover = await fsPack.simplifyFileFetch(el.img_path)
                    let projectObj = {
                        id_news: el.id_news,
                        title_eng: el.title_eng,
                        title_pt: el.title_pt,
                        description_eng: el.description_eng,
                        description_pt: el.description_pt,
                        published_date: el.published_date,
                        project_show_only: ((el.project_only === 0) ? false : true),
                        writer: el.full_name,
                        entity_initials: el.initials,
                        data_status: el.data_status,
                        creator: el.username,
                        cover: process.env.API_URL + el.img,
                        project_tags: ((projectTags.processRespCode === 200) ? projectTags.toClient.processResult : []),
                    }
                    project.push(projectObj)

                }
            }


            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: project,
                    processError: null,
                    processMsg: respMsg,
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });

    return processResp
};










/**
 *Add News
 *Status:Completed
 */
const addProjectNews = async (dataObj) => {
    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.title_eng) || !dataObj.req.sanitize(dataObj.req.body.title_pt) || !dataObj.req.sanitize(dataObj.req.body.published_date)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }


    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/NewsImagesGallery/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }

    let dataStatusFetchResult = await (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
    if (dataStatusFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }
    let newNewsid = uniqueIdPack.generateRandomId('_News')

    // let insertArray = [
    //     [newNewsid, dataObj.req.sanitize(dataObj.req.body.title_pt), dataObj.req.sanitize(dataObj.req.body.title_eng), dataObj.req.sanitize(dataObj.req.body.description_pt), dataObj.req.sanitize(dataObj.req.body.description_eng), dataObj.req.sanitize(dataObj.req.body.published_date), dataObj.idEntity, dataObj.idUser, pictureUploadResult.toClient.processResult.generatedId, dataStatusFetchResult.toClient.processResult[0].id_status],
    // ]
    await sequelize
        .query(
            `INSERT INTO News(id_news,title_pt,title_eng,description_pt,description_eng,published_date,id_entity,id_publisher,id_picture,id_status,project_only) VALUES (:id_news,:title_pt,:title_eng,:description_pt,:description_eng,:published_date,:id_entity,:id_publisher,:id_picture,:id_status,1);
            INSERT INTO Project_news(id_project, id_news) VALUES (:id_project,:id_news);
            `, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                    id_news: dataObj.req.sanitize(newNewsid),
                    title_pt: dataObj.req.sanitize(dataObj.req.body.title_pt),
                    title_eng: dataObj.req.sanitize(dataObj.req.body.title_eng),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                    published_date: dataObj.req.sanitize(dataObj.req.body.published_date),
                    id_entity: dataObj.idEntity,
                    id_publisher: dataObj.idUser,
                    id_picture: pictureUploadResult.toClient.processResult.generatedId,
                    id_status: dataStatusFetchResult.toClient.processResult[0].id_status
                },
                dialectOptions: {
                    multipleStatements: true
                }
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}

/**
 *Add News
 *Status:Completed
 */
const addEntityNews = async (dataObj) => {

    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.title_eng) || !dataObj.req.sanitize(dataObj.req.body.title_pt) || !dataObj.req.sanitize(dataObj.req.body.published_date)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }


    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/NewsImagesGallery/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }

    let dataStatusFetchResult = await (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
    if (dataStatusFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_News'), dataObj.req.sanitize(dataObj.req.body.title_pt), dataObj.req.sanitize(dataObj.req.body.title_eng), dataObj.req.sanitize(dataObj.req.body.description_pt), dataObj.req.sanitize(dataObj.req.body.description_eng), dataObj.req.sanitize(dataObj.req.body.published_date), dataObj.idEntity, dataObj.idUser, pictureUploadResult.toClient.processResult.generatedId, dataStatusFetchResult.toClient.processResult[0].id_status],
    ]
    await sequelize
        .query(
            `INSERT INTO News(id_news,title_pt,title_eng,description_pt,description_eng,published_date,id_entity,id_publisher,id_picture,id_status) VALUES  ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: NewsModel.News
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}




/**
 * edit News  
 * Status: Complete
 */
const editNews = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.title_eng) || !dataObj.req.sanitize(dataObj.req.body.title_pt) || !dataObj.req.sanitize(dataObj.req.body.published_date) || !dataObj.req.sanitize(dataObj.req.body.project_only)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }
    await sequelize
        .query(
            `UPDATE News SET title_pt=:title_pt,title_eng=:title_eng,description_pt=:description_pt,description_eng=:description_eng,published_date=:published_date,project_only=:project_only Where News.id_news=:id_news`, {
                replacements: {
                    id_news: dataObj.req.sanitize(dataObj.req.params.id),
                    title_pt: dataObj.req.sanitize(dataObj.req.body.title_pt),
                    title_eng: dataObj.req.sanitize(dataObj.req.body.title_eng),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                    published_date: dataObj.req.sanitize(dataObj.req.body.published_date),
                    project_only: dataObj.req.sanitize(dataObj.req.body.project_only)
                }
            }, {
                model: NewsModel.News
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "All data successfully  updated.",
                }
            }
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}

/**
 * Delete news  
 * Status: Complete
 */
const deleteNews = async (dataObj) => {
    let fetchResult = await fetchNewsImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }


    let deleteResult = {}
    if (fetchResult.toClient.processResult) {
        deleteResult = await pictureController.deletePictureInSystemById({
            req: dataObj.req,
            id_picture: fetchResult.toClient.processResult,
            folder: `/Images/NewsImagesGallery/`
        })
    }
    if (deleteResult.processRespCode !== 200) {
        return deleteResult
    } else {
        await sequelize
            .query(
                `DELETE FROM News Where News.id_news=:id_news;
                DELETE FROM Project_news Where Project_news.id_news=:id_news;
                `, {
                    replacements: {
                        id_news: dataObj.req.sanitize(dataObj.req.params.id)
                    },
                    dialectOptions: {
                        multipleStatements: true
                    }
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "Dta deleted Sucessfully",
                    }
                }

            })
            .catch(error => {
                console.log(error);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong, please try again later.",
                    }
                }
            });

        return processResp
    }


}


/**
 * Delete 
 * Status:Completed
 */
const updateNewsPicture = async (dataObj) => {
    let fetchResult = await fetchNewsImgId(dataObj.req.sanitize(dataObj.req.params.id))


    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await pictureController.updatePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/NewsImagesGallery/`
    })

    if (uploadResult.processRespCode !== 201) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE News SET News.id_picture =:id_picture  Where News.id_news=:id_news`, {
                    replacements: {
                        id_picture: uploadResult.toClient.processResult.generatedId,
                        id_news: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: NewsModel.News
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "The brand was updated successfully",
                    }
                }

            })
            .catch(error => {
                console.log(error);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong, please try again later.",
                    }
                }
            });
        return processResp
    }
}



/**
 * Patch  Couse status 
 * StatusCompleted
 */
const updateStatusNews = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.new_status)) {
        processResult = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Client request is incomplete !!"
            }
        }
        return processResult
    }
    let fetchResult = await dataStatusController.fetchDataStatusIdByDesignation(dataObj.req.sanitize(dataObj.req.body.new_status))
    if (fetchResult.processRespCode !== 200) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something when wrong please try again later",
            }
        }
        return processResult
    }

    await sequelize
        .query(
            `UPDATE News SET News.id_status =:id_status Where News.id_news=:id_news`, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_news: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: NewsModel.News
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The news status was updated successfully",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}








//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchNewsImgId = async (id_news) => {
    let processResp = {}
    await sequelize
        .query(`select id_picture from News where News.id_news =:id_news;`, {
            replacements: {
                id_news: id_news
            }
        }, {
            model: NewsModel.News
        })
        .then(data => {
            console.log(data);
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            // console.log(data[0][0].id_picture);
            // console.log(data[0].id_picture);
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: ((!data[0][0].id_picture) ? null : data[0][0].id_picture),
                    processError: null,
                    processMsg: respMsg,
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};






/**
 * Fetches all News related project
 * Status: Complete
 */
const fetchNewsRelatedProject = async (id_news) => {
    console.log(id_news);
    let processResp = {}
    let query = `Select Project.id_project,Project.initials from ((Project_news inner Join Project on Project.id_project = Project_news.id_project) 
    inner Join News on News.id_news =Project_news.id_news )  Where News.id_news =:id_news;`
    await sequelize
        .query(query, {
            replacements: {
                id_news: id_news
            }
        }, {
            model: ProjectNewsModel.Project_news
        })
        .then(data => {
            console.log(data);
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            // console.log(data[0].id_picture);
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};








module.exports = {
    initNews,
    fetchEntityNewsByIdEntity,
    //Admin 
    fetchNewsByAdmin,
    addProjectNews,
    addEntityNews,
    editNews,
    deleteNews,
    updateNewsPicture,
    updateStatusNews
}