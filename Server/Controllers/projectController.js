//main model
const ProjectModel = require("../Models/Project")

//Database Connection 
const sequelize = require("../Database/connection")
//middleware
const uniqueIdPack = require("../Middleware/uniqueId")

//Back Up Models
const ProjectAreaModel = require("../Models/ProjectArea")
const ProjectCourseModel = require("../Models/ProjectCourse")
const ProjectUnityModel = require("../Models/ProjectUnity")
const ProjectRecruitmentModel = require("../Models/ProjectRecruitment")

//Aux Controllers
const outsideInvestorModel = require("../Controllers/outsideInvestorController")

/**
 * Initialize the table Project by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initProject = async (dataObj) => {
    let processResp = {}
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
        [uniqueIdPack.generateRandomId('_Project'), `Technology, Environment, Creativity and Health`, `SmartHealth`, `TECH`, "Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.", "Using digitally-based technologies, TECH addresses prevention and promotion of population health and well-being, new technologies for agriculture and food production processes, and (e-) governance and integrated environmental policy.", `2021-04-02`, `2021-08-15`, `911-222-333`, `portic@ipp.pt`, dataObj.idCreator, dataObj.idEntity, dataObj.idDataStatus],
    ]
    await sequelize
        .query(
            `INSERT INTO Project (id_project,title,initials,desc_html_structure_eng,desc_html_structure_pt,start_date,end_date,project_contact,project_email,id_leader_entity,id_creator,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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


            let result = await outsideInvestorModel({
                idCreator: dataObj.idCreator
            })

            if (result.processResp === 201) {
                success.initOutsideInvestors = true
            }
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: null,
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

const fetchProjectByIdByInitials = async (title) => {
    let id = ""
    let query = `SELECT id_project From Project where Project.title =:title`
    await sequelize
        .query(query, {
            replacements: {
                title: title
            }
        }, {
            model: AreaUnityModel.Area_unity
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
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
module.exports = {
    fetchProjectByIdByInitials,
    initProject
}