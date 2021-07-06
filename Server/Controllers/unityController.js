const UnityModel = require("../Models/Unity")
const sequelize = require("../Database/connection")

const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")
//Controllers
const AreaUnityModel = require("../Models/AreaUnity") // done 
const CourseUnityModel = require("../Models/CourseUnity") // done
const ProjectUnityModel = require("../Models/ProjectUnity")
const RecruitmentUnityModel = require("../Models/RecruitmentUnity") // 


//Aux Controller 
const pictureController = require("../Controllers/pictureController")
const dataStatusController = require("../Controllers/dataStatusController")


// Env
require("dotenv").config();
// dfkjdsj
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_unity FROM Unity", {
            model: UnityModel.Unity
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


/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchEntityUnityByIdEntity = async (dataObj) => {
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

                    console.log(el.img_path);
                    // let imgFetch = await fsPack.simplifyFileFetch(el.img_path)



                    let projectTags = await selectUnityRelatedProjects(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng));
                    let courseTags = await selectUnityRelatedCourses(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let recruitmentTags = await selectUnityRelatedRecruitment(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let areaTags = await selectUnityRelatedAreas(el.id_unity, dataObj.req.sanitize(dataObj.req.params.lng))
                    let unityObj = {
                        id_unity: el.id_unity,
                        designation: el.designation,
                        description: el.description,
                        img: process.env.API_URL + el.img_path,
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
 */
const initUnity = async (dataObj) => {
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
        insertArray: [`/Images/UnitiesGalley/portoDesignFactory.jpeg`, `/Images/UnitiesGalley/startupPorto.jpeg`, `/Images/UnitiesGalley/portoBusinessInnovation.jpg`]
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
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Design Factory`, `A Porto Design Factory é um laboratório de ideias com base no trabalho interdisciplinar, na investigação aplicada e na colaboração industrial. Aqui, os alunos das mais diferentes áreas cooperam no desenvolvimento de projetos inovadores com a ambição de promover uma mentalidade empreendedora através de um modelo de educação baseado na aprendizagem orientada para a resolução de problemas. Nos nossos programas educativos, equipas internacionais interdisciplinares (misturando estudantes de engenharia, design, comunicação, ciências empresariais, educação, etc do P.PORTO e estudantes de um vasto conjunto de universidades internacionais parceiras) trabalham em conjunto para responder a desafios de inovação propostos por parceiros empresariais nacionais e internacionais, desde startups e PME a grandes multinacionais. Através dos projetos, os estudantes passam por um processo intenso e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novas ideias de produto ou serviço e provas de conceito. Ponto de encontro das oito Escolas, a Porto Design Factory (PDF) integra a Design Factory Global Network (DFGN), composta por 20 instituições de quatro continentes. Esta rede possibilita o intercâmbio de alunos e docentes entre os diferentes núcleos, além da troca e partilha de conhecimentos e a colaboração em projetos. A DFGN está instalada em todos os continentes, de Helsínquia a Xangai, de Melbourne a Santiago do Chile, passando pela Holanda, Genebra ou Nova Iorque. Ao encorajar um ecossistema inovador centrado no diálogo interdisciplinar e no trabalho em equipa acreditamos dar as ferramentas necessárias para criar a capacidade de resposta e ajustamento ao tecido socioeconómico da região, designadamente junto das indústrias de maior significado.`, `Porto Design Factory  (PDF) is a lab of ideas based on interdisciplinary work, applied research and industrial collaboration. It is in here that students from different areas cooperate in the development of projects with the ambition of promoting an entrepreneurial mindset. PDF offers several educational programs with different time frames, goals and pedagogical methodologies targeted to students, post-graduates and business professionals interested in creative and innovative skills. Our educational programs have stand of been interdisciplinary and international, by mixing people from the fields of engineering, design, communication, business, education etc. and  from a wide range of international universities. Teams then work on innovational challenges settled by national and international companies, from startups and SMEs to large multinationals.  Through the projects, the participants undergo an intensive and iterative process of need finding, idealization and fast prototyping, to create and develop new product or service ideas and proofs of concept. PDF is part of the Design Factory Global Network (DFGN), composed of 20 institutions from four continents. This network enables the exchange of students and teachers between the different centers, in addition to the exchange and sharing of knowledge and collaboration on projects. DFGN is located on all continents, from Helsinki to Shanghai, from Melbourne to Santiago de Chile, through the Netherlands, Geneva or New York. We believe in giving the necessary tools to create the strength to respond and adjust to the socio-economic points of the region by encouraging an innovative ecosystem centered on interdisciplinary dialogue and teamwork.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[0], dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Unity'), `Startup Porto`, `A Startup Porto tem como objetivo promover o surgimento e o desenvolvimento de uma nova geração de negócios, promovendo programas de empreendedorismo, não apenas para o ecossistema do Porto, mas para todo o país. O nosso objetivo é facilitar o processo entre a imaginação de um produto e a inserção do mesmo no mercado. Para isso, oferecemos uma ampla gama de programas, como pré-aceleração, aceleração e eventos para interligar empreendedores e investidores, que terão como alvo diferentes estágios de desenvolvimento. É essencial haver um espaço de rede entre startups, indústria e educação, e por essa mesma razão, a Startup Porto ambiciona criar esse elo através do nosso processo de incubação e parcerias com outras redes similares tais como as Innovation Hubs. O que pretendemos atingir com a Startup Porto é: - Indústrias criativas; - Economia circular e CLEANTECH; - ETECH; - FINTECH; - Cuidados de saúde; - Hospitalidade e turismo (e novos alimentos); - Indústria 4.0; - Economia Social.`, `Porto Business Innovation Porto Business Innovation (PBI) is a connection between academia, business reality, society and public administrations. Based on knowledge and process innovation, Porto Business Innovation aims to promote new business opportunities and develop new products and services to reach the market quickly. PBI benefits from the Porto Polytechnic's several areas of activity, such as its researchers and research units, to promote consulting services to companies. PBI's areas of expertise are engineering in partnership with ISEP and ESTG, business with ISCAP and ESTG, health through ESS, creative industries with ESMAD, ESE and ESMAE and finally hospitality and tourism through ESHT. Porto Business Innovation offers the community the following services: - Wood based prototyping; - 3D and 2D printing; -Introduction workshops to various subjects; - Project consulting; - Electronics; - Reservation of daily workshops; - Complementary training.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[1], dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Business Innovation`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[2], dataObj.idDataStatus],
    ]
    await sequelize
        .query(
            `INSERT INTO Unity (id_unity,designation,description_pt,description_eng,id_entity,id_photo,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
 * Todo
 * @param {String} id_area id of the area that we want the tags
 */
const selectUnityRelatedAreas = async (id_unity, lng) => {
    let processResp = {}
    let query = (lng !== 'pt') ? `SELECT Area.id_area, Area.designation_pt as designation FROM ((  Area_unity  inner Join 
        Unity on Unity.id_unity= Area_unity.id_unity)
        Inner Join
        Area on Area.id_area = Area_unity.id_area) WHERE Unity.id_unity=:id_unity;` : `SELECT Area.id_area, Area.designation_eng as designation FROM ((  Area_unity  inner Join 
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




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/**
 *Add new area focus  
 *Status:Completed
 */
const addUnit = async (dataObj) => {
    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng)) {
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


    let dataStatusFetchResult = (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
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


    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/UnitiesGalley/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        console.log("here");
        return pictureUploadResult
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Unit'), dataObj.req.sanitize(dataObj.req.body.designation), dataObj.req.sanitize(dataObj.req.body.description_pt), dataObj.req.sanitize(dataObj.req.body.description_eng), dataObj.idEntity, pictureUploadResult.toClient.processResult.generatedId, dataStatusFetchResult.toClient.processResult[0].id_status],
    ]
    await sequelize
        .query(
            `INSERT INTO Unity (id_unity,designation,description_pt,description_eng,id_entity,id_photo,id_status) VALUES  ${insertArray.map(element => '(?)').join(',')};`, {
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
 *Fetch all area focus based on some admin data  
 *Status:Completed
 */

//!

/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchUnitsByAdmin = async (dataObj) => {
    let processResp = {}
    let query = (dataObj.user_level === `Super Admin`) ? `Select Unity.id_unity,Unity.designation, Unity.description_eng, Unity.description_pt,Unity.created_at, Picture.img_path as img, Entity.initials ,Data_Status.designation as data_status
    from  (((Unity INNER JOIN Picture ON Picture.id_picture = Unity.id_photo) 
    INNER JOIN Entity on Entity.id_entity = Unity.id_entity) 
    INNER JOIN Data_Status on Data_Status.id_status = Unity.id_status);` : `Select Unity.id_unity,Unity.designation, Unity.description_eng, Unity.description_pt,Unity.created_at, Picture.img_path as img, Entity.initials , Data_Status.designation as data_status
    from  (((Unity INNER JOIN Picture ON Picture.id_picture = Unity.id_photo) 
    INNER JOIN Entity on Entity.id_entity = Unity.id_entity) 
    INNER JOIN Data_Status on Data_Status.id_status = Unity.id_status) Where Entity.id_entity =:id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
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
                    let projectTags = await selectUnityRelatedProjects(el.id_unity, "pt");
                    let courseTags = await selectUnityRelatedCourses(el.id_unity, "pt")
                    let recruitmentTags = await selectUnityRelatedRecruitment(el.id_unity, "pt")
                    let areaTags = await selectUnityRelatedAreas(el.id_unity, "pt")
                    let unityObj = {
                        id_unity: el.id_unity,
                        designation: el.designation,
                        description_pt: el.description_pt,
                        description_eng: el.description_eng,
                        entity_initials: el.initials,
                        data_status: el.data_status,
                        created_at: el.created_at,
                        img: process.env.API_URL + el.img,
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


//!

/**
 * edit unit information
 * Status: Complete
 */
const editUnit = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng)) {
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


    await sequelize
        .query(
            `UPDATE Unity SET designation=:designation,description_eng=:description_eng,description_pt=:description_pt Where Unity.id_unity=:id_unity`, {
                replacements: {
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id),
                    designation: dataObj.req.sanitize(dataObj.req.body.designation),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                }
            }, {
                model: UnityModel.Unity
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The media was updated successfully",
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
 * Delete 
 * Status:Completed
 */
const updateUnitPicture = async (dataObj) => {
    let fetchResult = await fetchUnitImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await pictureController.updatePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/UnitiesGalley/`
    })


    if (uploadResult.processRespCode !== 201) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE Unity SET Unity.id_photo =:id_photo Where Unity.id_unity=:id_unity `, {
                    replacements: {
                        id_photo: uploadResult.toClient.processResult.generatedId,
                        id_unity: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: UnityModel.Unity
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
 *Delete Unit 
 *Status completed
 */
const deleteUnit = async (dataObj) => {
    let fetchResult = await fetchUnitImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let deleteResult = await pictureController.deletePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/UnitiesGalley/`
    })


    if (deleteResult.processRespCode !== 200) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `DELETE FROM Unity Where Unity.id_unity=:id_unity;
                DELETE  FROM Course_unity Where Course_unity.id_unity =:id_unity;
                DELETE  FROM Project_unity Where Project_unity.id_unity =:id_unity;
                DELETE  FROM Recruitment_unity Where Recruitment_unity.id_unity =:id_unity;
                DELETE  FROM Area_unity Where Area_unity.id_unity =:id_unity;
                `, {
                    replacements: {
                        id_unity: dataObj.req.sanitize(dataObj.req.params.id)
                    },
                    dialectOptions: {
                        multipleStatements: true
                    }
                },
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


//*Complement
/**
 * Fetches Unit img based on unit id
 * Status: Complete
 */
const fetchUnitImgId = async (id_unity) => {
    let processResp = {}
    await sequelize
        .query(`select id_photo From Unity where Unity.id_unity =:id_unity;`, {
            replacements: {
                id_unity: id_unity
            }
        }, {
            model: UnityModel.Unity
        })
        .then(data => {
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
                    processResult: ((!data[0][0].id_photo) ? null : data[0][0].id_photo),
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
 * Patch  Media status 
 * StatusCompleted
 */
const updateUnitStatus = async (dataObj) => {
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
            `UPDATE Unity SET Unity.id_status =:id_status  Where Unity.id_unity=:id_unity `, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: UnityModel.Unity
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data[0],
                    // {
                    //     // pt_answer: "Perfil actualizado com sucesso!",
                    //     // en_answer: "Profile updated Successfully"
                    // },
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








module.exports = {
    initUnity,
    fetchAllUnities,
    fetchEntityUnityByIdEntity,

    // Admin 
    fetchUnitsByAdmin,
    deleteUnit,
    addUnit,
    updateUnitPicture,
    editUnit,
    updateUnitStatus

}