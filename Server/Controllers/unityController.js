const UnityModel = require("../Models/Unity")
const sequelize = require("../Database/connection")

const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")

const AreaUnityModel = require("../Models/AreaUnity") // done 
const CourseUnityModel = require("../Models/CourseUnity") // done
const ProjectUnityModel = require("../Models/ProjectUnity")
const RecruitmentUnityModel = require("../Models/RecruitmentUnity") // 





/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchEntityUnityByIdEntity = async (dataObj, callback) => {
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
        return callback(false, processResp)

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `Select Unity.id_unity, Unity.designation, Unity.description_pt as description, Picture.img_path from  ((Unity INNER JOIN Picture ON Picture.id_picture = Unity.id_photo) INNER JOIN Data_Status ON Data_Status.id_status = Unity.id_status) WHERE Data_Status.designation ="Published" and Unity.id_entity =:id_entity` : `Select Unity.id_unity, Unity.designation, Unity.description_eng as description, Picture.img_path from  ((Unity INNER JOIN Picture ON Picture.id_picture = Unity.id_photo) INNER JOIN Data_Status ON Data_Status.id_status = Unity.id_status) WHERE Data_Status.designation ="Published" and Unity.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: UnityModel.Unity
        })
        .then(async data => {
            let unities = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)
                    let projectTags = await selectUnityRelatedProjects(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng));
                    let courseTags = await selectUnityRelatedCourses(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let recruitmentTags = await selectUnityRelatedRecruitment(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let areaTags = await selectUnityRelatedAreas(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let unityObj = {
                        id_unity: el.id_unity,
                        designation: el.designation,
                        description: el.description,
                        img: await (imgFetch.processRespCode === 200) ? imgFetch.toClient.processResult : [],
                        course_tags: courseTags,
                        project_tags: projectTags,
                        recruitment_tags: recruitmentTags,
                        area_tags: areaTags,
                    }
                    unities.push(unityObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: unities,
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)
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
            return callback(false, processResp)
        });
};









const fetchAllUnities = (dataObj, callback) => {
    sequelize
        .query("SELECT * FROM Unity", {
            model: UnityModel.Unity
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            let processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};









/**
 * Initialize the table Unity by introducing predefined data to it.
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initUnity = async (dataObj, callback) => {
    let processResp = {}
    console.log(dataObj);
    if (dataObj.idCreator === null || dataObj.idDataStatus === null || dataObj.idEntity === null || dataObj.imgsIds.length !== 3) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, processResp)
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Design Factory`, `A Porto Design Factory é um laboratório de ideias com base no trabalho interdisciplinar, na investigação aplicada e na colaboração industrial. Aqui, os alunos das mais diferentes áreas cooperam no desenvolvimento de projetos inovadores com a ambição de promover uma mentalidade empreendedora através de um modelo de educação baseado na aprendizagem orientada para a resolução de problemas. Nos nossos programas educativos, equipas internacionais interdisciplinares (misturando estudantes de engenharia, design, comunicação, ciências empresariais, educação, etc do P.PORTO e estudantes de um vasto conjunto de universidades internacionais parceiras) trabalham em conjunto para responder a desafios de inovação propostos por parceiros empresariais nacionais e internacionais, desde startups e PME a grandes multinacionais. Através dos projetos, os estudantes passam por um processo intenso e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novas ideias de produto ou serviço e provas de conceito. Ponto de encontro das oito Escolas, a Porto Design Factory (PDF) integra a Design Factory Global Network (DFGN), composta por 20 instituições de quatro continentes. Esta rede possibilita o intercâmbio de alunos e docentes entre os diferentes núcleos, além da troca e partilha de conhecimentos e a colaboração em projetos. A DFGN está instalada em todos os continentes, de Helsínquia a Xangai, de Melbourne a Santiago do Chile, passando pela Holanda, Genebra ou Nova Iorque. Ao encorajar um ecossistema inovador centrado no diálogo interdisciplinar e no trabalho em equipa acreditamos dar as ferramentas necessárias para criar a capacidade de resposta e ajustamento ao tecido socioeconómico da região, designadamente junto das indústrias de maior significado.`, `A Porto Design Factory é um laboratório de ideias com base no trabalho interdisciplinar, na investigação aplicada e na colaboração industrial. Aqui, os alunos das mais diferentes áreas cooperam no desenvolvimento de projetos inovadores com a ambição de promover uma mentalidade empreendedora através de um modelo de educação baseado na aprendizagem orientada para a resolução de problemas. Nos nossos programas educativos, equipas internacionais interdisciplinares (misturando estudantes de engenharia, design, comunicação, ciências empresariais, educação, etc do P.PORTO e estudantes de um vasto conjunto de universidades internacionais parceiras) trabalham em conjunto para responder a desafios de inovação propostos por parceiros empresariais nacionais e internacionais, desde startups e PME a grandes multinacionais. Através dos projetos, os estudantes passam por um processo intenso e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novas ideias de produto ou serviço e provas de conceito. Ponto de encontro das oito Escolas, a Porto Design Factory (PDF) integra a Design Factory Global Network (DFGN), composta por 20 instituições de quatro continentes. Esta rede possibilita o intercâmbio de alunos e docentes entre os diferentes núcleos, além da troca e partilha de conhecimentos e a colaboração em projetos. A DFGN está instalada em todos os continentes, de Helsínquia a Xangai, de Melbourne a Santiago do Chile, passando pela Holanda, Genebra ou Nova Iorque. Ao encorajar um ecossistema inovador centrado no diálogo interdisciplinar e no trabalho em equipa acreditamos dar as ferramentas necessárias para criar a capacidade de resposta e ajustamento ao tecido socioeconómico da região, designadamente junto das indústrias de maior significado.`, dataObj.idEntity, dataObj.imgsIds[0], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_Unity'), `Startup Porto`, `A Startup Porto tem como objetivo promover o surgimento e o desenvolvimento de uma nova geração de negócios, promovendo programas de empreendedorismo, não apenas para o ecossistema do Porto, mas para todo o país. O nosso objetivo é facilitar o processo entre a imaginação de um produto e a inserção do mesmo no mercado. Para isso, oferecemos uma ampla gama de programas, como pré-aceleração, aceleração e eventos para interligar empreendedores e investidores, que terão como alvo diferentes estágios de desenvolvimento. É essencial haver um espaço de rede entre startups, indústria e educação, e por essa mesma razão, a Startup Porto ambiciona criar esse elo através do nosso processo de incubação e parcerias com outras redes similares tais como as Innovation Hubs. O que pretendemos atingir com a Startup Porto é: - Indústrias criativas; - Economia circular e CLEANTECH; - ETECH; - FINTECH; - Cuidados de saúde; - Hospitalidade e turismo (e novos alimentos); - Indústria 4.0; - Economia Social.`, `A Startup Porto tem como objetivo promover o surgimento e o desenvolvimento de uma nova geração de negócios, promovendo programas de empreendedorismo, não apenas para o ecossistema do Porto, mas para todo o país. O nosso objetivo é facilitar o processo entre a imaginação de um produto e a inserção do mesmo no mercado. Para isso, oferecemos uma ampla gama de programas, como pré-aceleração, aceleração e eventos para interligar empreendedores e investidores, que terão como alvo diferentes estágios de desenvolvimento. É essencial haver um espaço de rede entre startups, indústria e educação, e por essa mesma razão, a Startup Porto ambiciona criar esse elo através do nosso processo de incubação e parcerias com outras redes similares tais como as Innovation Hubs. O que pretendemos atingir com a Startup Porto é: - Indústrias criativas; - Economia circular e CLEANTECH; - ETECH; - FINTECH; - Cuidados de saúde; - Hospitalidade e turismo (e novos alimentos); - Indústria 4.0; - Economia Social.`, dataObj.idEntity, dataObj.imgsIds[1], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Business Innovation`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, dataObj.idEntity, dataObj.imgsIds[2], dataObj.idDataStatus, dataObj.idCreator],
    ]
    await sequelize
        .query(
            `INSERT INTO Unity (id_unity,designation,description_pt,description_eng,id_entity,id_photo,id_status, id_creator) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UnityModel.Unity
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
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
}






/**
 * Todo
 * @param {String} id_area id of the area that we want the tags
 */
const selectUnityRelatedAreas = async (id_unity, lng) => {
    let processResp = {}
    let query = (lng !== 'pt') ? `SELECT Area.id_area, Area.description_pt as description FROM ((  Area_unity  inner Join 
        Unity on Unity.id_unity= Area_unity.id_unity)
        Inner Join
        Area on Area.id_area = Area_unity.id_area) WHERE Unity.id_unity=:id_unity;` : `SELECT Area.id_area, Area.description_eng as description FROM ((  Area_unity  inner Join 
        Unity on Unity.id_unity= Area_unity.id_unity)
        Inner Join
        Area on Area.id_area = Area_unity.id_area) WHERE Unity.id_unity =:id_unity `
    await sequelize
        .query(query, {
            replacements: {
                id_unity: id_unity
            }
        }, {
            model: AreaUnityModel.Area_unity
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
            let processResp = {
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


const selectUnityRelatedCourses = async (id_unity, lng) => {
    let processResp = {}
    let query = `SELECT Course.id_course, Course.designation FROM(((  Course_unity  inner Join 
        Course on Course.id_course= Course_unity.id_course)
        Inner Join
        Unity on Unity.id_unity= Course_unity.id_unity)
        Inner Join
        Data_Status on Data_Status.id_status= Course.id_status)  where Data_Status.designation= 'Published' and Unity.id_unity=:id_unity`
    await sequelize
        .query(query, {
            replacements: {
                id_unity: id_unity
            }
        }, {
            model: CourseUnityModel.Course_unity
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

const selectUnityRelatedRecruitment = async (id_unity, lng) => {
    let processResp = {}
    let query = (lng == 'pt') ? `SELECT Available_position.id_available_position, Available_position.designation_pt as designation FROM((  Recruitment_unity  inner Join 
        Available_position on Available_position.id_available_position= Recruitment_unity.id_available_position)
        Inner Join
        Unity on Unity.id_unity = Recruitment_unity.id_unity) where  Unity.id_unity=:id_unity;` : `SELECT Available_position.id_available_position, Available_position.designation_eng as designation FROM((  Recruitment_unity  inner Join 
            Available_position on Available_position.id_available_position= Recruitment_unity.id_available_position)
            Inner Join
            Unity on Unity.id_unity = Recruitment_unity.id_unity) where  Unity.id_unity=:id_unity;`

    await sequelize
        .query(query, {
            replacements: {
                id_unity: id_unity
            }
        }, {
            model: RecruitmentUnityModel.Recruitment_unity
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


const selectUnityRelatedProjects = async (id_unity, lng) => {
    let processResp = {}
    let query = `SELECT Project.id_project, Project.title FROM(( ( Project_unity  inner Join 
        Project on Project.id_project= Project_unity.id_project)
        Inner Join
        Unity on Unity.id_unity= Project_unity.id_unity) 
        Inner Join
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Unity.id_unity=:id_unity`
    await sequelize
        .query(query, {
            replacements: {
                id_unity: id_unity
            }
        }, {
            model: ProjectUnityModel.Project_unity
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








module.exports = {
    initUnity,
    fetchAllUnities,
    fetchEntityUnityByIdEntity

}