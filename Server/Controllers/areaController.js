const AreaModel = require("../Models/Area")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
const AreaUnityModel = require("../Models/AreaUnity") // done 
const CourseAreaModel = require("../Models/CourseArea") // done
const ProjectAreaModel = require("../Models/ProjectArea")
const RecruitmentAreaModel = require("../Models/RecruitmentAreas") // 



/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchEntityAreaByIdEntity = async (dataObj, callback) => {
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

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `select Area.id_area , Area.designation_pt as designation ,Area.description_pt as description, Area.page_url from Area where Area.id_entity = :id_entity;` : `select Area.id_area , Area.designation_eng as designation ,Area.description_eng as description, Area.page_url from Area where Area.id_entity = :id_entity;`;

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: AreaModel.Area
        })
        .then(async data => {
            let areas = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
                let processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return callback(true, processResp)
            } else {
                for (const el of data[0]) {
                    let = await selectAreaRelatedProjects("nada", dataObj.req.sanitize(dataObj.req.params.lng));
                    console.log(something);

                    let areaObj = {
                        id_area: el.id_area,
                        designation: el.designation,
                        description: el.description,
                        page_url: el.page_url,
                        // course_tags: selectAreaRelatedProjects(el.id_area, dataObj.req.sanitize(dataObj.req.params.lng)).toClient.processResult
                    }

                    areas.push(areaObj)

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
            return callback(false, processResp)
        });
};



/**
 * Initialize the table Menu by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initAreas = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null) {

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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Area'), "Industry 4.0", "Industry 4.0", `We are in a new stage, the Fourth Industrial Revolution, in which technological advances enable significant changes in industry. However, there are significant challenges regarding the skills needed, such as critical thinking and creativity to promote problem-solving, to work in Industry 4.0, be it digital transformation, new processes or new business models. Dealing with these challenges requires integrated actions from training to innovation services, which are able to support the required fast transformation of technology, processes and human resources.`, `We are in a new stage, the Fourth Industrial Revolution, in which technological advances enable significant changes in industry. However, there are significant challenges regarding the skills needed, such as critical thinking and creativity to promote problem-solving, to work in Industry 4.0, be it digital transformation, new processes or new business models. Dealing with these challenges requires integrated actions from training to innovation services, which are able to support the required fast transformation of technology, processes and human resources.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Cybersecurity", "Cybersecurity", `In order to fully realize the benefits that the emerging digital society is expected to bring, we are required to understand and address the risks which are at stake – the same technologies which promise to facilitate operations also bring significant challenges. Mitigating risks whilst promoting the benefits, requires reliable and secure digital systems, a challenge that can only be tackled with a strong ecosystem of research, development and innovation.`, `In order to fully realize the benefits that the emerging digital society is expected to bring, we are required to understand and address the risks which are at stake – the same technologies which promise to facilitate operations also bring significant challenges. Mitigating risks whilst promoting the benefits, requires reliable and secure digital systems, a challenge that can only be tackled with a strong ecosystem of research, development and innovation.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Health Technologies", "Health Technologies", `The increasing importance of health and well-being, the support to independent and active life, requires the development of innovative technologies, tools and digital solutions to diagnose, treat, or prevent health problems, leading to more effective and efficient healthcare, improving quality and efficiency of interventions. Solutions need multidisciplinary approaches, which are able to deliver and implement suitable, trustable, safe, and cost-effective healthcare, with the needs of people at a center stage.`, `The increasing importance of health and well-being, the support to independent and active life, requires the development of innovative technologies, tools and digital solutions to diagnose, treat, or prevent health problems, leading to more effective and efficient healthcare, improving quality and efficiency of interventions. Solutions need multidisciplinary approaches, which are able to deliver and implement suitable, trustable, safe, and cost-effective healthcare, with the needs of people at a center stage.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Biotechnology", "Biotechnology", `With the current situation related to the COVID-19 pandemic, the Industrial and Medical Biotechnology Laboratory of PORTIC mobilized to provide testing for SARS-CoV-2, as well as to study and develop methodologies and devices for SARS-CoV-2, in many different environments.`, `With the current situation related to the COVID-19 pandemic, the Industrial and Medical Biotechnology Laboratory of PORTIC mobilized to provide testing for SARS-CoV-2, as well as to study and develop methodologies and devices for SARS-CoV-2, in many different environments.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Digital Innovation", "Digital Innovation", `The continuous evolution of digital systems is transforming irrevocably the way organizations operate and interoperate, a transformation which is expected only to accelerate. Digital transformation challenges the operation of companies (in particular SMEs), with higher difficulties in traditional sectors, creative industries or tourism. In this context, it is necessary to develop and consolidate innovative processes and services, promoting the digitalization and the development of digital platforms and circular economy models.`, `The continuous evolution of digital systems is transforming irrevocably the way organizations operate and interoperate, a transformation which is expected only to accelerate. Digital transformation challenges the operation of companies (in particular SMEs), with higher difficulties in traditional sectors, creative industries or tourism. In this context, it is necessary to develop and consolidate innovative processes and services, promoting the digitalization and the development of digital platforms and circular economy models.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Creativity and Innovation", "Creativity and Innovation", `Porto Design Factory (@Porto Global Hub) is a laboratory of ideas based on interdisciplinary work, applied research and industrial collaboration, where students from different areas cooperate in the development of projects submitted by companies, with the ambition of promoting an entrepreneurial mindset. Porto Design Factory offers several educational programs with educational objectives and methodologies aimed at students, graduates and professionals, interested in creative and innovative skills.`, `Porto Design Factory (@Porto Global Hub) is a laboratory of ideas based on interdisciplinary work, applied research and industrial collaboration, where students from different areas cooperate in the development of projects submitted by companies, with the ambition of promoting an entrepreneurial mindset. Porto Design Factory offers several educational programs with educational objectives and methodologies aimed at students, graduates and professionals, interested in creative and innovative skills.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Entrepreneurship and Incubation", "Entrepreneurship and Incubation", `Through Startup Porto (@Porto Global Hub), we promote and develop a new generation of business through entrepreneurship programs and support for startups. The objective is to facilitate the process between imagining a product and taking it to the market, through programs such as pre-acceleration, acceleration and events to connect entrepreneurs and investors, at different stages of development.`, `Through Startup Porto (@Porto Global Hub), we promote and develop a new generation of business through entrepreneurship programs and support for startups. The objective is to facilitate the process between imagining a product and taking it to the market, through programs such as pre-acceleration, acceleration and events to connect entrepreneurs and investors, at different stages of development.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Area'), "Innovation Services", "Innovation Services", `Through Porto Business Innovation (@Porto Global Hub) we link academia, business and society. Based on knowledge and innovation, Porto Business Innovation promotes new business opportunities and supports the development of new products and services, benefiting from the different areas of activity of PORTIC to promote consultancy services to companies.`, `Through Porto Business Innovation (@Porto Global Hub) we link academia, business and society. Based on knowledge and innovation, Porto Business Innovation promotes new business opportunities and supports the development of new products and services, benefiting from the different areas of activity of PORTIC to promote consultancy services to companies.`, dataObj.idUser, dataObj.idEntity],
    ]
    sequelize
        .query(
            `INSERT INTO Area(id_area,designation_pt,designation_eng,description_pt,description_eng,id_publisher,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: AreaModel.Area
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
 * Fetches all Menus 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchAreas = (req, callback) => {
    sequelize
        .query("SELECT * FROM Area", {
            model: AreaModel.Area
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
 * Todo
 * @param {String} id_area id of the area that we want the tags
 */
const selectAreaRelatedUnity = (id_area, lng) => {
    let processResp = {}
    let query = `SELECT Unity.id_unity, Unity.designation FROM(((  Area_unity  inner Join 
        Unity on Unity.id_unity= Area_unity.id_unity)
        Inner Join
        Area on Area.id_area = Area_unity.id_area)
        Inner Join
        Data_Status on Data_Status.id_status= Unity.id_status)  where Data_Status.designation= 'Published' and  Area.id_area =:id_area;`;

    sequelize
        .query(query, {
            replacements: {
                id_area: id_area
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
            return processResp
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
            return callback(false, processResp)
        });

}


const selectAreaRelatedCourse = (id_area, lng) => {
    let processResp = {}
    let query = `SELECT Course.id_course, Course.designation FROM(((  Course_area  inner Join 
        Course on Course.id_course= Course_area.id_course)
        Inner Join
        Area on Area.id_area = Course_area.id_area)
        Inner Join
        Data_Status on Data_Status.id_status= Course.id_status)  where Data_Status.designation= 'Published' and Area.id_area =:id_area`

    sequelize
        .query(query, {
            replacements: {
                id_area: id_area
            }
        }, {
            model: CourseAreaModel.Course_area
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
            return processResp
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
            return processResp
        });

}



const selectAreaRelatedRecruitment = (id_area, lng) => {
    let processResp = {}
    let query = (lng === 'eng') ? `SELECT Available_position.id_available_position, Available_position.designation_eng as designation FROM((  Recruitment_area  inner Join 
        Available_position on Available_position.id_available_position= Recruitment_area.id_available_position)
        Inner Join
        Area on Area.id_area = Recruitment_area.id_area) where  Area.id_area =:id_area;` : `SELECT Available_position.id_available_position, Available_position.designation_pt as designation FROM((  Recruitment_area  inner Join 
            Available_position on Available_position.id_available_position= Recruitment_area.id_available_position)
            Inner Join
            Area on Area.id_area = Recruitment_area.id_area) where  Area.id_area =:id_Area;`

    sequelize
        .query(query, {
            replacements: {
                id_area: id_area
            }
        }, {
            model: RecruitmentAreaModel.Recruitment_area
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
            return processResp
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
            return processResp
        });

}

const selectAreaRelatedProjects = async (id_area, lng) => {
    let processResp = {}
    let query = `SELECT Project.id_project, Project.title FROM(( ( Project_area  inner Join 
        Project on Project.id_project= Project_area.id_project)
        Inner Join
        Area on Area.id_area = Project_area.id_area) 
        Inner Join
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Area.id_area =:id_area;`

    await sequelize
        .query(query, {
            replacements: {
                id_area: id_area
            }
        }, {
            model: ProjectAreaModel.Project_area
        })
        .then(data => {
            console.log(data);
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
    fetchEntityAreaByIdEntity,
    initAreas,
    fetchAreas

}