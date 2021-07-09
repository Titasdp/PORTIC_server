//main model
const ProjectModel = require("../Models/Project")

//Database Connection 
const sequelize = require("../Database/connection")
//middleware
const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")

//Back Up Models
const ProjectAreaModel = require("../Models/ProjectArea")
const ProjectCourseModel = require("../Models/ProjectCourse")
const ProjectUnityModel = require("../Models/ProjectUnity")
const ProjectRecruitmentModel = require("../Models/ProjectRecruitment")

const insideInvestorModel = require("../Models/ProjectInsideInvestor")
const ProjectGalleryModel = require("../Models/ProjectGallery")

const ProjectNewsModel = require("../Models/NewsProject")


//Aux Controllers
const outsideInvestorController = require("../Controllers/outsideInvestorController")
const insideInvestorController = require("../Controllers/insideInvestorController")
const projectTeamController = require("../Controllers/projectTeamController")
const pictureController = require("../Controllers/pictureController")
const dataStatusController = require("../Controllers/dataStatusController")
const govInvestorController = require("../Controllers/governmentInvestorController")
const externalCollaboratorController = require("../Controllers/externalCollaboratorController")


// 



// .Env
require("dotenv").config();





/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchEntityProjectByIdEntity = async (dataObj) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Project.id_project,Project.summary_pt as summary,Project.reference, Project.title,Project.initials, desc_html_structure_pt as desc_html_structure, Project.start_date, Project.end_date, Project.project_contact,Project.project_email, Project.pdf_path  FROM( Project INNER JOIN 
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Project.id_leader_entity =:id_entity;` : ` SELECT Project.id_project ,Project.summary_eng as summary,Project.reference, Project.title,Project.initials, desc_html_structure_eng as desc_html_structure, Project.start_date, Project.end_date, Project.project_contact,Project.project_email,Project.pdf_path  FROM( Project INNER JOIN 
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Project.id_leader_entity =:id_entity `
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: ProjectModel.Project
        })
        .then(async data => {
            let project = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let areaTags = await selectProjectRelatedArea(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng));
                    let courseTags = await selectProjectRelatedCourse(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng))
                    let recruitmentTags = await selectProjectRelatedRecruitment(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng))
                    let unityTags = await selectProjectRelatedUnity(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng))
                    // let insideInvestors = await selectProjectInsideInvestor(el.id_project)
                    let outsideInvestors = await outsideInvestorController.fetchProjectOutsideInvestor(el.id_project)
                    let govInvestors = await govInvestorController.fetchProjectGovInvestor(el.id_project)
                    let externalCollaborators = await externalCollaboratorController.fetchProjectExternalCollaborator(el.id_project)
                    let news = await selectProjectNews(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng))
                    let galleryImgs = await selectProjectGallery(el.id_project)
                    let projectTeam = await selectProjectTeam(el.id_project)
                    // let pdf = await fsPack.simplifyFileFetch(el.pdf_path)

                    let projectObj = {
                        id_project: el.id_project,
                        reference: el.reference,
                        title: el.title,
                        initials: el.initials,
                        summary: el.summary,
                        desc_html_structure: el.desc_html_structure,
                        start_date: el.start_date,
                        end_date: el.end_date,
                        project_contact: el.project_contact,
                        project_email: el.project_email,
                        pdf_path: (!el.pdf_path) ? null : process.env.API_URL + el.pdf_path,
                        // inside_investors: ((insideInvestors.processRespCode === 200) ? insideInvestors.toClient.processResult : []),
                        outside_investors: ((outsideInvestors.processRespCode === 200) ? outsideInvestors.toClient.processResult : []),
                        govInvestors: ((govInvestors.processRespCode === 200) ? govInvestors.toClient.processResult : []),
                        externalCollaborators: ((externalCollaborators.processRespCode === 200) ? externalCollaborators.toClient.processResult : []),
                        news: ((news.processRespCode === 200) ? news.toClient.processResult : []),
                        gallery_imgs: ((galleryImgs.processRespCode === 200) ? galleryImgs.toClient.processResult : []),
                        project_team: ((projectTeam.processRespCode === 200) ? projectTeam.toClient.processResult : []),
                        course_tags: courseTags,
                        area_tags: areaTags,
                        recruitment_tags: recruitmentTags,
                        unity_tags: unityTags,

                        // project_sheet: await (pdf.processRespCode === 200) ? pdf.toClient.processResult : [],

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


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_project FROM Project", {
            model: ProjectModel.Project
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

const fetchProjectByIdByInitials = async (initials) => {
    let id = ""
    let query = `SELECT id_project From Project where Project.initials =:initials`
    await sequelize
        .query(query, {
            replacements: {
                initials: initials
            }
        }, {
            model: ProjectModel.Project
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data.length === 0) {
                id = null
            } else {
                id = data[0][0].id_project
            }
        })
        .catch(error => {
            console.log(error);
            id = null
        });
    return id
}


/**
 * Initialize the table Project by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initProject = async (dataObj) => {

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

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Project'), `sumário...`, `summary...`, `CYBERSecurity SciEntific Competences and Innovation Potential`, `CybersSeCIP`, `Project led by PORTIC, to further strength the scientific competences and innovation potential of the North region, to tackle the cybersecurity challenge, through investment in a small set of enabling technologies and knowledge, in a coherent program organized in two research lines: one related to the design and protection of secure digital systems, and a second centered on data security and privacy.`, `Projecto liderado pela PORTIC, para reforçar ainda mais as competências científicas e o potencial de inovação da região Norte, para fazer face ao desafio da cibersegurança, através do investimento num pequeno conjunto de tecnologias facilitadoras e de conhecimentos, num programa coerente organizado em duas linhas de investigação: uma relacionada com o projeto e a proteção de sistemas digitais seguros, e um segundo centrado na segurança e privacidade dos dados.
        `, `2021-04-02`, `2021-04-02`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `sumário...`, `summary...`, `Research, Development and Demonstration of Advanced Solutions for Railway`, `FERROVIA 4.0`, `The overall objective of the project is to develop different components, tools and systems, to be tested on rolling stock and real infrastructures, which are oriented towards the economic and ecological sustainability of the railway system, to reduce operating and maintenance costs; for reliable information systems to support decision-making in asset management and for the creation of security systems capable of monitoring the infrastructure and triggering alerts and protection / intervention measures. It is also the ambition of the project to ensure that cybersecurity technologies and methodologies are incorporated into the structure of information and communication technologies of the railway system, in order to avoid unwanted intrusions.`, `O objetivo geral do projeto é desenvolver diferentes componentes, ferramentas e sistemas, a testar em material circulante e em infraestruturas reais, orientados para a sustentabilidade económica e ecológica do sistema ferroviário, de forma a reduzir os custos de operação e manutenção; para sistemas de informação fiáveis ??de apoio à tomada de decisão na gestão de activos e para a criação de sistemas de segurança capazes de monitorizar a infra-estrutura e despoletar alertas e medidas de protecção / intervenção. É também ambição do projeto garantir que as tecnologias e metodologias de cibersegurança sejam incorporadas na estrutura das tecnologias de informação e comunicação do sistema ferroviário, de forma a evitar intrusões indesejadas. ”~
        `, `2021-08-15`, `2021-04-02`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `sumário...`, `summary...`, `Bio-based and digital strategies to improve well-being and promote green health`, `GreenHealth`, `The GreenHealth project is focused on digital and biological technologies and their interaction with human health, environmental sustainability and territory-based assets economic development. This multidisciplinary and interdisciplinary approach will enable the design and implementation of a long-term, human-centred strategy focused on the (eco)sustainability of the Norte Region."
        `, `O projeto GreenHealth está focado em tecnologias digitais e biológicas e sua interação com a saúde humana, sustentabilidade ambiental e desenvolvimento econômico de ativos baseados em território. Esta abordagem multidisciplinar e interdisciplinar irá permitir a concepção e implementação de uma estratégia de longo prazo, centrada no ser humano e focada na (eco) sustentabilidade da Região Norte. ”
        `, `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `sumário...`, `summary...`, `Artificial Artificial Intelligence for Personalized Lifelong Health Care`, `SmartHealth`, `SmartHealth intends to create new efficient and intelligent technologies to support different stages of the medical treatment, namely the prevention, diagnosis, surgical treatment, rehabilitation and patient follow-up.", "SmartHealth intends to create new efficient and intelligent technologies to support different stages of the medical treatment, namely the prevention, diagnosis, surgical treatment, rehabilitation and patient follow-up.`, `A SmartHealth pretende criar novas tecnologias eficientes e inteligentes para apoiar as diferentes fases do tratamento médico, nomeadamente a prevenção, diagnóstico, tratamento cirúrgico, reabilitação e acompanhamento do paciente.`, `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `sumário...`, `summary...`, `Technology, Environment, Creativity and Health`, `TECH`, `Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.", "Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.`, `Usando tecnologias de base digital, TECH aborda a prevenção e promoção da saúde e bem-estar da população, novas tecnologias para a agricultura e processos de produção de alimentos e (e-) governança e política ambiental integrada.`, `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
    ]
    await sequelize
        .query(
            `INSERT INTO Project (id_project,summary_pt,summary_eng,title,initials,desc_html_structure_eng,desc_html_structure_pt,start_date,end_date,project_contact,project_email,id_coordinator,id_leader_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: ProjectModel.Project
            }
        )
        .then(async data => {
            let success = {
                initProject: true,
                initOutsideInvestors: false
            }

            let project1id = await fetchProjectByIdByInitials("CybersSeCIP")
            let project2id = await fetchProjectByIdByInitials("FERROVIA 4.0")
            let project3id = await fetchProjectByIdByInitials("GreenHealth")
            let project4id = await fetchProjectByIdByInitials("SmartHealth")
            let project5id = await fetchProjectByIdByInitials("TECH")


            let initOutsideInvestor = await outsideInvestorController.initOutsideInvestors({
                idCreator: dataObj.idCreator,
                project1id: project1id,
                project2id: project2id,
                project3id: project3id,
                project4id: project4id,
                project5id: project5id,
            })

            let initInsideInvestor = await insideInvestorController.initInsideInvestors({
                idEntity: dataObj.idEntity,
                project1id: project1id,
                project2id: project2id,
                project3id: project3id,
                project4id: project4id,
                project5id: project5id,
            })

            let intiProjectTeam = await projectTeamController.initProjectTeam({
                idUser: dataObj.idCreator,
                project1id: project1id,
                project2id: project2id,
                project3id: project3id,
                project4id: project4id,
                project5id: project5id,
            })


            if (initOutsideInvestor.processResp === 201 || initInsideInvestor.processResp === 201 || intiProjectTeam.processResp === 201) {
                success.initOutsideInvestors = true
            }
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: true,
                    processError: null,
                    processMsg: "All data Where created successfully. But There has been a problem and not all tables data where filled.",
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






// !

const selectProjectRelatedUnity = async (id_project, lng) => {
    let processResp = {}
    let query = `SELECT Unity.id_unity, Unity.designation FROM(((  Project_unity  inner Join 
        Unity on Unity.id_unity= Project_unity.id_unity)
        Inner Join
        Project on Project.id_project= Project_unity.id_project)
        Inner Join
        Data_Status on Data_Status.id_status= Unity.id_status)  where Data_Status.designation= 'Published' and  Project.id_project =:id_project`;

    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectUnityModel.Project_unity
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data.length === 0) {
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
    return processResp.toClient.processResult

}


const selectProjectRelatedCourse = async (id_project, lng) => {
    let processResp = {}
    let query = `SELECT Course.id_course, Course.designation FROM((( Project_course  inner Join 
        Course on Course.id_course= Project_course.id_course)
        Inner Join
        Project on Project.id_project = Project_course.id_project)
        Inner Join
        Data_Status on Data_Status.id_status= Course.id_status)  where Data_Status.designation= 'Published' and   Project.id_project=:id_project`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectCourseModel.Project_course
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
    return processResp.toClient.processResult

}



const selectProjectRelatedRecruitment = async (id_project, lng) => {
    let processResp = {}
    let query = (lng == 'pt') ? `SELECT Available_position.id_available_position, Available_position.designation_pt as desigantion FROM((  Project_recruitment inner Join 
        Project on Project.id_project= Project_recruitment.id_project)
        Inner Join
        Available_position on Available_position.id_available_position = Project_recruitment.id_available_position) 
      where Project.id_project=:id_project ;` : `  SELECT Available_position.id_available_position, Available_position.designation_eng as desigantion FROM((  Project_recruitment inner Join 
        Project on Project.id_project= Project_recruitment.id_project)
        Inner Join
        Available_position on Available_position.id_available_position = Project_recruitment.id_available_position) 
      where Project.id_project=:id_project ;`

    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectRecruitmentModel.Project_recruitment
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
    return processResp.toClient.processResult

}

const selectProjectRelatedArea = async (id_project, lng) => {
    let processResp = {}
    let query = (lng === 'pt') ? `SELECT Area.id_area, Area.designation_pt as designation FROM((Project_area  inner Join 
        Project on Project.id_project= Project_area.id_project)
        Inner Join
        Area on Area.id_area = Project_area.id_area) 
         where Project.id_project =:id_project;` : `SELECT Area.id_area, Area.designation_eng as designation FROM((Project_area  inner Join 
            Project on Project.id_project= Project_area.id_project)
            Inner Join
            Area on Area.id_area = Project_area.id_area) 
             where Project.id_project =:id_project;`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectAreaModel.Project_area
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
    return processResp.toClient.processResult
}

// Working
const selectProjectInsideInvestor = async (id_project) => {
    let processResp = {}
    let query = `SELECT Entity.id_entity, Entity.initials as designation FROM(((Project_inside_investor  inner Join 
        Project on Project.id_project= Project_inside_investor.id_project)
        Inner Join
        Entity on Entity.id_entity= Project_inside_investor.id_entity) INNER JOIN  
          Data_Status on Data_Status.id_status= Entity.id_status
       )
        where Project.id_project =:id_project and Data_Status.designation= 'Published';`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: insideInvestorModel.Project_inside_investor
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data.length === 0) {
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



const selectProjectNews = async (id_project, lng) => {
    let processResp = {}
    let query = (lng == 'pt') ? `  SELECT News.id_news, News.title_pt as title , News.description_pt as description , News.published_date , Picture.img_path, User.full_name  FROM(((((Project_news  inner Join 
        Project on Project.id_project= Project_news.id_project)
        Inner Join
        News on News.id_news = Project_news.id_news) 
        INNER JOIN 
        Picture on Picture.id_picture = News.id_picture)
        INNER JOIN  Data_Status on Data_Status.id_status = News.id_status )
        INNER JOIN 
        User on User.id_user = News.id_publisher)
        where Project.id_project =:id_project and Data_Status.designation= 'Published';` : `SELECT News.id_news, News.title_eng as title , News.description_eng as description , News.published_date , Picture.img_path, User.full_name  FROM(((((Project_news  inner Join 
            Project on Project.id_project= Project_news.id_project)
            Inner Join
            News on News.id_news = Project_news.id_news) 
            INNER JOIN 
            Picture on Picture.id_picture = News.id_picture)
            INNER JOIN  Data_Status on Data_Status.id_status = News.id_status )
            INNER JOIN 
            User on User.id_user = News.id_publisher)
            where Project.id_project = :id_project and Data_Status.designation= 'Published';`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectNewsModel.Project_news
        })
        .then(async data => {
            let newsArray = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {


                for (const el of data[0]) {
                    let newsObj = {
                        id_news: el.id_news,
                        title: el.title,
                        description: el.description,
                        published_date: el.published_date,
                        id_news: el.id_news,
                        cover: process.env.API_URL + el.img_path,
                    }
                    newsArray.push(newsObj)
                }
            }

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: newsArray,
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
                    processResult: newsArray,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp

}



const selectProjectGallery = async (id_project) => {
    let processResp = {}
    let query = `SELECT Picture.id_picture, Picture.img_path FROM((Project_gallery  inner Join 
        Project on Project.id_project= Project_gallery.id_project)
        Inner Join
        Picture on Picture.id_picture= Project_gallery.id_image) 
         where Project.id_project = :id_project`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectGalleryModel.Project_gallery
        })
        .then(async data => {
            let galleryArray = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    galleryArray.push({
                        id_picture: el.id_picture,
                        img: process.env.API_URL + el.img_path
                    })
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: galleryArray,
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
                    processResult: galleryArray,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp

}



const selectProjectTeam = async (id_project) => {
    let processResp = {}
    let query = `SELECT User.id_user,User.full_name, User.email,User.phone_numb,User.id_picture,User.post From (( ( Project_team  inner Join 
        Project on Project.id_project = Project_team.id_project)
        Inner Join
        User on User.id_user= Project_team.id_team_member)
        Inner Join
        User_status on User_status.id_status= User.id_status)  where User_status.designation= 'Normal' and   Project.id_project=:id_project;`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectGalleryModel.Project_gallery
        })
        .then(async data => {
            let teamMemberArray = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {

                    let teamMemberObj = {
                        id_user: el.id_user,
                        full_name: el.full_name,
                        email: el.email,
                        phone_number: el.phone_numb,
                        post: el.post,
                        picture: null
                    }

                    if (el.id_picture !== null) {
                        let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);
                        teamMemberObj.picture = process.env.API_URL + fetchImgResult.toClient.processResult
                    }
                    teamMemberArray.push(teamMemberObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: teamMemberArray,
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

}


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Admin !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchProjectByAdminAndDev = async (dataObj) => {
    let processResp = {}

    let query = (dataObj.user_level === `Super Admin`) ? `Select Project.id_project, Project.summary_eng, Project.summary_pt, Project.title, Project.initials , Project.reference  , Project.desc_html_structure_eng, Project.desc_html_structure_pt  ,Project.start_date, Project.end_date,Project.project_contact,Project.project_email,Project.pdf_path,Project.created_at ,User.username, Data_Status.designation  ,Entity.initials as entity
    From (((Project Inner Join Data_Status on Data_Status.id_status = Project.id_status ) 
    INNER JOIN  User on User.id_user = Project.id_coordinator)
    Inner join Entity on Entity.id_entity = Project.id_leader_entity);` : ((dataObj.user_level === `Coord. Entidade`) ? `Select Project.id_project, Project.summary_eng, Project.summary_pt, Project.title, Project.initials , Project.reference  , Project.desc_html_structure_eng, Project.desc_html_structure_pt  ,Project.start_date, Project.end_date,Project.project_contact,Project.project_email,Project.pdf_path,Project.created_at ,User.username, Data_Status.designation  ,Entity.initials as entity
        From (((Project Inner Join Data_Status on Data_Status.id_status = Project.id_status ) 
        INNER JOIN  User on User.id_user = Project.id_coordinator)
        Inner join Entity on Entity.id_entity = Project.id_leader_entity)  Where Entity.id_entity =  :id_entity;` : `Select Project.id_project, Project.summary_eng, Project.summary_pt, Project.title, Project.initials , Project.reference  , Project.desc_html_structure_eng, Project.desc_html_structure_pt  ,Project.start_date, Project.end_date,Project.project_contact,Project.project_email,Project.pdf_path,Project.created_at ,User.username, Data_Status.designation  ,Entity.initials as entity
        From ((((Project Inner Join Data_Status on Data_Status.id_status = Project.id_status ) 
        INNER JOIN  User on User.id_user = Project.id_coordinator)
        Inner join Entity on Entity.id_entity = Project.id_leader_entity)
        INNER JOIN Project_team on Project_team.id_project = Project.id_project)  
        Where Project_team.id_team_member = :id_user or Project.id_coordinator = :id_user and Project_team.can_edit =1;`)
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: ProjectModel.Project
        })
        .then(async data => {
            let project = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let areaTags = await selectProjectRelatedArea(el.id_project, "pt");
                    let courseTags = await selectProjectRelatedCourse(el.id_project, "pt")
                    let recruitmentTags = await selectProjectRelatedRecruitment(el.id_project, "pt")
                    let unityTags = await selectProjectRelatedUnity(el.id_project, "pt")
                    // let insideInvestors = await selectProjectInsideInvestor(el.id_project)
                    let outsideInvestors = await outsideInvestorController.fetchProjectOutsideInvestor(el.id_project)
                    let govInvestors = await govInvestorController.fetchProjectGovInvestor(el.id_project)
                    let externalCollaborators = await externalCollaboratorController.fetchProjectExternalCollaborator(el.id_project)
                    let news = await fetchProjectNewsByAdmin(el.id_project)
                    let galleryImgs = await selectProjectGallery(el.id_project)
                    let projectTeam = await FetchProjectTeamForAdmin(el.id_project)


                    let projectObj = {
                        id_project: el.id_project,
                        title: el.title,
                        initials: el.initials,
                        reference: el.reference,
                        summary_eng: el.summary_eng,
                        summary_pt: el.summary_pt,
                        desc_html_structure_pt: el.desc_html_structure_pt,
                        desc_html_structure_eng: el.desc_html_structure_eng,
                        start_date: el.start_date,
                        end_date: el.end_date,
                        project_contact: el.project_contact,
                        project_email: el.project_email,
                        pdf_path: (!el.pdf_path) ? null : process.env.API_URL + el.pdf_path,
                        created_at: el.created_at,
                        entity_initials: el.entity,
                        data_status: el.data_status,
                        coordinator: el.username,
                        outside_investors: ((outsideInvestors.processRespCode === 200) ? outsideInvestors.toClient.processResult : []),
                        govInvestors: ((outsideInvestors.processRespCode === 200) ? govInvestors.toClient.processResult : []),
                        externalCollaborators: ((externalCollaborators.processRespCode === 200) ? externalCollaborators.toClient.processResult : []),
                        news: ((news.processRespCode === 200) ? news.toClient.processResult : []),
                        gallery_imgs: ((galleryImgs.processRespCode === 200) ? galleryImgs.toClient.processResult : []),
                        project_team: ((projectTeam.processRespCode === 200) ? projectTeam.toClient.processResult : []),
                        course_tags: courseTags,
                        area_tags: areaTags,
                        recruitment_tags: recruitmentTags,
                        unity_tags: unityTags,


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
 *Add Project
 *Status:Completed
 */
const addProject = async (dataObj) => {
    console.log(dataObj.req.body);
    // console.log(dataObj.req.body);
    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.title) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.start_date) || !dataObj.req.sanitize(dataObj.req.body.end_date) || !dataObj.req.sanitize(dataObj.req.body.project_contact) || !dataObj.req.sanitize(dataObj.req.body.project_email) || !dataObj.req.sanitize(dataObj.req.body.summary_eng), !dataObj.req.sanitize(dataObj.req.body.summary_pt) || !dataObj.req.sanitize(dataObj.req.body.coordinator)) {
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
    let pdfUploadResult = null
    if ((dataObj.req.files.file) != null) {
        pdfUploadResult = await addProjectPdf(dataObj)
        if (pdfUploadResult.processRespCode !== 200) {
            return pdfUploadResult
        }
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
    let randomId = uniqueIdPack.generateRandomId('_Project')
    // let insertArray = [
    //     [randomId, dataObj.req.sanitize(dataObj.req.body.title), dataObj.req.sanitize(dataObj.req.body.initials), (!dataObj.req.sanitize(dataObj.req.body.reference)) ? null : dataObj.req.sanitize(dataObj.req.body.reference), dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng), dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt), dataObj.req.sanitize(dataObj.req.body.project_contact), dataObj.req.sanitize(dataObj.req.body.project_email), dataObj.req.sanitize(dataObj.req.body.start_date), dataObj.req.sanitize(dataObj.req.body.end_date), (pdfUploadResult == null) ? null : (pdfUploadResult.toClient.processResult), dataObj.idEntity, dataObj.idUser, dataStatusFetchResult.toClient.processResult[0].id_status]
    // ]

    await sequelize
        .query(
            `INSERT INTO Project(id_project,summary_pt,summary_eng,title,initials,reference,desc_html_structure_eng,desc_html_structure_pt,project_contact,project_email,start_date,end_date,pdf_path,id_leader_entity,id_coordinator,id_status) VALUES (:id_project,:summary_pt,:summary_eng,:title,:initials,:reference,:desc_html_structure_eng,:desc_html_structure_pt,:project_contact,:project_email,:start_date,:end_date,:pdf_path,:id_leader_entity,:id_coordinator,:id_status);
                  INSERT INTO Project_team(id_project, id_team_member,can_edit) VALUES (:id_project,:id_coordinator,1) ;
            `, {
                replacements: {
                    id_project: randomId,
                    title: dataObj.req.sanitize(dataObj.req.body.title),
                    initials: dataObj.req.sanitize(dataObj.req.body.initials),
                    reference: (!dataObj.req.sanitize(dataObj.req.body.reference)) ? null : dataObj.req.sanitize(dataObj.req.body.reference),
                    desc_html_structure_eng: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng),
                    desc_html_structure_pt: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt),
                    summary_eng: dataObj.req.sanitize(dataObj.req.body.summary_eng),
                    summary_pt: dataObj.req.sanitize(dataObj.req.body.summary_pt),
                    project_contact: dataObj.req.sanitize(dataObj.req.body.project_contact),
                    project_email: dataObj.req.sanitize(dataObj.req.body.project_email),
                    start_date: dataObj.req.sanitize(dataObj.req.body.start_date),
                    end_date: dataObj.req.sanitize(dataObj.req.body.end_date),
                    pdf_path: (pdfUploadResult == null) ? null : (pdfUploadResult.toClient.processResult),
                    id_leader_entity: dataObj.idEntity,
                    id_coordinator: dataObj.req.sanitize(dataObj.req.body.coordinator),
                    id_status: dataStatusFetchResult.toClient.processResult[0].id_status
                },
                dialectOptions: {
                    multipleStatements: true
                }
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
 * Update
 * Status:Completed
 */
const updatePdf = async (dataObj) => {
    if (!dataObj.req.params.id) {
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
    let fetchResult = await fetchProjectPdfById(dataObj.req.sanitize(dataObj.req.params.id))


    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await updateProjectPdf({
        req: dataObj.req,
        deletePath: fetchResult.toClient.processResult,
    })


    if (uploadResult.processRespCode !== 200) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE Project SET Project.pdf_path =:pdf_path  Where Project.id_project=:id_project `, {
                    replacements: {
                        pdf_path: uploadResult.toClient.processResult,
                        id_project: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: ProjectModel.Project
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "The file was updated successfully",
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
 * edit Project  
 * Status: Complete
 */
const editProject = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.title) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.start_date) || !dataObj.req.sanitize(dataObj.req.body.start_date) || !dataObj.req.sanitize(dataObj.req.body.end_date) || !dataObj.req.sanitize(dataObj.req.body.project_contact) || !dataObj.req.sanitize(dataObj.req.body.project_email) || !dataObj.req.sanitize(dataObj.req.body.summary_eng), !dataObj.req.sanitize(dataObj.req.body.summary_pt), !dataObj.req.sanitize(dataObj.req.body.coordinator)) {
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
            `UPDATE Project SET title=:title,initials=:initials,summary_eng=:summary_eng,summary_pt=:summary_pt, reference =:reference, desc_html_structure_eng =:desc_html_structure_eng,desc_html_structure_pt=:desc_html_structure_pt,start_date=:start_date,
            end_date=:end_date,id_coordinator=:id_coordinator,  project_contact=:project_contact,project_email=:project_email Where Project.id_project=:id_project`, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                    title: dataObj.req.sanitize(dataObj.req.body.title),
                    initials: dataObj.req.sanitize(dataObj.req.body.initials),
                    reference: (!dataObj.req.sanitize(dataObj.req.body.reference)) ? null : dataObj.req.sanitize(dataObj.req.body.reference),
                    desc_html_structure_eng: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng),
                    desc_html_structure_pt: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt),
                    summary_eng: dataObj.req.sanitize(dataObj.req.body.summary_eng),
                    summary_pt: dataObj.req.sanitize(dataObj.req.body.summary_pt),
                    start_date: dataObj.req.sanitize(dataObj.req.body.start_date),
                    end_date: dataObj.req.sanitize(dataObj.req.body.end_date),
                    project_contact: dataObj.req.sanitize(dataObj.req.body.project_contact),
                    project_email: dataObj.req.sanitize(dataObj.req.body.project_email),
                    id_coordinator: dataObj.req.sanitize(dataObj.req.body.coordinator),
                    //!
                }
            }, {
                model: ProjectModel.Project
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The Area was updated successfully",
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




/**
 * Patch  Couse status 
 * StatusCompleted
 */
const updateStatusProject = async (dataObj) => {
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
            `UPDATE Project SET Project.id_status =:id_status Where Project.id_project=:id_project`, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_project: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: ProjectModel.Project
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The project status was updated successfully",
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



const addProjectGalleryImage = async (dataObj) => {
    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/ProjectsGallery/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {

        return pictureUploadResult
    }

    let insertArray = [
        [dataObj.req.sanitize(dataObj.req.params.id), pictureUploadResult.toClient.processResult.generatedId],
    ]


    await sequelize
        .query(
            `INSERT INTO Project_gallery(id_project,id_image) VALUES  ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: ProjectGalleryModel.Project_gallery
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

const deleteProjectGalleryImage = async (dataObj) => {
    let deleteResult = await pictureController.deletePictureInSystemById({
        req: dataObj.req,
        id_picture: dataObj.req.sanitize(dataObj.req.params.id_picture),
        folder: `/Images/ProjectsGallery/`
    })

    if (deleteResult.processRespCode !== 200) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `DELETE FROM Project_gallery Where Project_gallery.id_image=:id_image and Project_gallery.id_project =:id_project`, {
                    replacements: {
                        id_image: dataObj.req.sanitize(dataObj.req.params.id_picture),
                        id_project: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: ProjectGalleryModel.Project_gallery
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "Image sucessfully removed from the gallery",
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








//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchProjectPdfById = async (id_project) => {
    let processResp = {}
    await sequelize
        .query(`select pdf_path from Project where Project.id_project =:id_project;`, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectModel.Project
        })
        .then(data => {

            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: ((!data[0][0].pdf_path) ? null : data[0][0].pdf_path),
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


const addProjectPdf = async (dataObj) => {
    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a pdf file attach to the request.",
            }
        }
        return processResp
    }

    if (dataObj.req.files.file === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a pdf file attach to the request.",
            }
        }
        return processResp
    }

    if (!await fsPack.confirmIsPdf(dataObj.req.sanitize(dataObj.req.files.file.mimetype))) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The file attached must be an pdf file.",
            }
        }
        return processResp
    } else {
        let fileUploadResult = await fsPack.simpleFileUpload({
            req: dataObj.req,
            folder: `/Assets/`
        })
        return fileUploadResult
    }
}


/**
 * Delete Area  
 * StatusCompleted
 */
const deleteProject = async (dataObj) => {
    let processResp = {}
    let query = `DELETE  FROM Project Where Project.id_project = :id_project;
    DELETE  FROM Project_unity Where id_project = :id_project;
    DELETE  FROM Project_area Where id_project = :id_project;
    DELETE  FROM Project_recruitment Where id_project = :id_project;
    DELETE  FROM Project_course Where id_project = :id_project;
    DELETE  FROM Project_news Where id_project = :id_project;
    DELETE  FROM Project_gallery Where id_project = :id_project;
    DELETE  FROM Outside_investor Where id_project = :id_project;
    `
    await sequelize
        .query(
            query, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id)
                },
                dialectOptions: {
                    multipleStatements: true
                }
            },
        )
        .then(data => {
            console.log(data);
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data Deleted Successfully",
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


const updateProjectPdf = async (dataObj) => {

    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a pdf file attach to the request.",
            }
        }
        return processResp
    }

    if (dataObj.req.files.file === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a pdf file attach to the request.",
            }
        }
        return processResp
    }
    if (!await fsPack.confirmIsPdf(dataObj.req.sanitize(dataObj.req.files.file.mimetype))) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The file attached must be an pdf file.",
            }
        }
        return processResp
    } else {
        let fileDeleteResult = null
        if (dataObj.deletePath !== null) {
            fileDeleteResult = await fsPack.simpleFileDelete({
                deletePath: dataObj.deletePath, //Old Path
            })
        }
        if (dataObj.deletePath !== null) {
            if (fileDeleteResult.processRespCode !== 200) {
                return fileDeleteResult
            }
        }
        let fileUploadResult = await fsPack.simpleFileUpload({
            req: dataObj.req,
            folder: `/Assets/`
        })
        return fileUploadResult
    }

}



const fetchProjectNewsByAdmin = async (id_project) => {
    let query = ` SELECT News.id_news, News.title_pt, News.title_eng , News.description_eng ,News.description_pt, News.published_date , Picture.img_path,Entity.initials ,User.username, Data_Status.designation as data_statu  FROM((((((Project_news  inner Join 
        Project on Project.id_project= Project_news.id_project)
        Inner Join
        News on News.id_news = Project_news.id_news) 
        INNER JOIN 
        Picture on Picture.id_picture = News.id_picture)
        INNER JOIN  Data_Status on Data_Status.id_status = News.id_status )
        INNER JOIN 
        User on User.id_user = News.id_publisher)
          INNER JOIN Entity on Entity.id_entity = News.id_entity) 
        where Project_news.id_project =:id_project;`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        })
        .then(async data => {
            let projects = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {

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
                        cover: process.env.API_URL + el.img_path,
                    }
                    projects.push(projectObj)

                }
            }


            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: projects,
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


const FetchProjectTeamForAdmin = async (id_project) => {
    let processResp = {}
    let query = `SELECT User.id_user,User.full_name, User.email,User.phone_numb,User.id_picture , Project_team.can_edit From ((  Project_team  inner Join 
        Project on Project.id_project = Project_team.id_project)
        Inner Join
        User on User.id_user= Project_team.id_team_member)  where Project.id_project=:id_project;`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ProjectGalleryModel.Project_gallery
        })
        .then(async data => {
            let teamMemberArray = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {

                    let teamMemberObj = {
                        id_user: el.id_user,
                        full_name: el.full_name,
                        email: el.email,
                        phone_number: el.phone_numb,
                        picture: null,
                        can_edit: el.can_edit
                    }
                    console.log(el.id_picture);
                    if (el.id_picture !== null) {
                        let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);
                        console.log(fetchImgResult);
                        teamMemberObj.picture = process.env.API_URL + fetchImgResult.toClient.processResult
                    }
                    teamMemberArray.push(teamMemberObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: teamMemberArray,
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
                    processResult: teamMemberArray,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp

}



module.exports = {
    fetchProjectByIdByInitials,
    initProject,
    fetchEntityProjectByIdEntity,

    // 
    fetchProjectByAdminAndDev,
    addProject,
    updatePdf,
    editProject,
    updateStatusProject,
    addProjectGalleryImage,
    deleteProjectGalleryImage,
    deleteProject

}