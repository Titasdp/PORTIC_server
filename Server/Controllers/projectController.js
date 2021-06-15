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
const ProjectNewsModel = require("../Models/ProjectNews")


//Aux Controllers
const outsideInvestorController = require("../Controllers/outsideInvestorController")
const insideInvestorController = require("../Controllers/insideInvestorController")
const projectTeamController = require("../Controllers/projectTeamController")
const pictureController = require("../Controllers/pictureController")





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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Project.id_project, Project.title,Project.initials, desc_html_structure_pt as desc_html_structure, Project.start_date, Project.end_date, project_contact,project_email  FROM( Project INNER JOIN 
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Project.id_leader_entity =:id_entity;` : ` SELECT Project.id_project, Project.title,Project.initials, desc_html_structure_eng as desc_html_structure, Project.start_date, Project.end_date, project_contact,project_email  FROM( Project INNER JOIN 
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
                    let insideInvestors = await selectProjectInsideInvestor(el.id_project)
                    let outsideInvestors = await outsideInvestorController.fetchProjectOutsideInvestor(el.id_project)
                    let news = await selectProjectNews(el.id_project, dataObj.req.sanitize(dataObj.req.params.lng))
                    let galleryImgs = await selectProjectGallery(el.id_project)
                    let projectTeam = await selectProjectTeam(el.id_project)



                    let projectObj = {
                        id_project: el.id_project,
                        title: el.title,
                        initials: el.initials,
                        desc_html_structure: el.desc_html_structure,
                        start_date: el.start_date,
                        end_date: el.end_date,
                        project_contact: el.project_contact,
                        project_email: el.project_email,

                        inside_investors: ((insideInvestors.processRespCode === 200) ? insideInvestors.toClient.processResult : []),
                        outside_investors: ((outsideInvestors.processRespCode === 200) ? outsideInvestors.toClient.processResult : []),
                        news: ((news.processRespCode === 200) ? news.toClient.processResult : []),
                        gallery_imgs: ((galleryImgs.processRespCode === 200) ? galleryImgs.toClient.processResult : []),
                        project_team: ((projectTeam.processRespCode === 200) ? projectTeam.toClient.processResult : "bostou"),
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
        [uniqueIdPack.generateRandomId('_Project'), `CYBERSecurity SciEntific Competences and Innovation Potential`, `CybersSeCIP`, `Project led by PORTIC, to further strength the scientific competences and innovation potential of the North region, to tackle the cybersecurity challenge, through investment in a small set of enabling technologies and knowledge, in a coherent program organized in two research lines: one related to the design and protection of secure digital systems, and a second centered on data security and privacy.`, `Project led by PORTIC, to further strength the scientific competences and innovation potential of the North region, to tackle the cybersecurity challenge, through investment in a small set of enabling technologies and knowledge, in a coherent program organized in two research lines: one related to the design and protection of secure digital systems, and a second centered on data security and privacy.`, `2021-04-02`, `2021-04-02`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `Research, Development and Demonstration of Advanced Solutions for Railway`, `FERROVIA 4.0`, `The overall objective of the project is to develop different components, tools and systems, to be tested on rolling stock and real infrastructures, which are oriented towards the economic and ecological sustainability of the railway system, to reduce operating and maintenance costs; for reliable information systems to support decision-making in asset management and for the creation of security systems capable of monitoring the infrastructure and triggering alerts and protection / intervention measures. It is also the ambition of the project to ensure that cybersecurity technologies and methodologies are incorporated into the structure of information and communication technologies of the railway system, in order to avoid unwanted intrusions."
        `, `The overall objective of the project is to develop different components, tools and systems, to be tested on rolling stock and real infrastructures, which are oriented towards the economic and ecological sustainability of the railway system, to reduce operating and maintenance costs; for reliable information systems to support decision-making in asset management and for the creation of security systems capable of monitoring the infrastructure and triggering alerts and protection / intervention measures. It is also the ambition of the project to ensure that cybersecurity technologies and methodologies are incorporated into the structure of information and communication technologies of the railway system, in order to avoid unwanted intrusions."
        `, `2021-08-15`, `2021-04-02`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `Bio-based and digital strategies to improve well-being and promote green health`, `GreenHealth`, `The GreenHealth project is focused on digital and biological technologies and their interaction with human health, environmental sustainability and territory-based assets economic development. This multidisciplinary and interdisciplinary approach will enable the design and implementation of a long-term, human-centred strategy focused on the (eco)sustainability of the Norte Region."
        `, `The GreenHealth project is focused on digital and biological technologies and their interaction with human health, environmental sustainability and territory-based assets economic development. This multidisciplinary and interdisciplinary approach will enable the design and implementation of a long-term, human-centred strategy focused on the (eco)sustainability of the Norte Region.
        `, `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `Artificial Artificial Intelligence for Personalized Lifelong Health Care`, `SmartHealth`, "SmartHealth intends to create new efficient and intelligent technologies to support different stages of the medical treatment, namely the prevention, diagnosis, surgical treatment, rehabilitation and patient follow-up.", "SmartHealth intends to create new efficient and intelligent technologies to support different stages of the medical treatment, namely the prevention, diagnosis, surgical treatment, rehabilitation and patient follow-up.", `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Project'), `Technology, Environment, Creativity and Health`, `TECH`, "Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.", "Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.", `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
    ]
    await sequelize
        .query(
            `INSERT INTO Project (id_project,title,initials,desc_html_structure_eng,desc_html_structure_pt,start_date,end_date,project_contact,project_email,id_creator,id_leader_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
    let query = `SELECT Entity.id_entity, Entity.initials FROM(((Project_inside_investor  inner Join 
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
    let query = (lng == 'pt') ? `SELECT News.id_news, News.title_pt as title , News.resume_pt as resume , News.published_date FROM((Project_news  inner Join 
        Project on Project.id_project= Project_news.id_project)
        Inner Join
        News on News.id_news = Project_news.id_news) 
         where Project.id_project = :id_project` : `SELECT News.id_news, News.title_eng as title , News.resume_eng as resume , News.published_date FROM((Project_news  inner Join 
        Project on Project.id_project= Project_news.id_project)
        Inner Join
        News on News.id_news = Project_news.id_news) 
         where Project.id_project = :id_project;`
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
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
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)
                    if (imgFetch.processRespCode === 200) {
                        galleryArray.push(imgFetch.toClient.processResult)
                    }
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
    let query = `SELECT User.id_user,User.full_name, User.email,User.phone_numb,User.id_picture From (( ( Project_team  inner Join 
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
                        picture: null
                    }

                    if (el.id_picture === null) {
                        let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);
                        teamMemberObj.picture = fetchImgResult.toClient.processResult
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
    fetchEntityProjectByIdEntity
}