const AvailablePositionModel = require("../Models/AvailablePosition") //Main Model
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
//SecondaryController

// const categoryController = require("../Controllers/categoryController")
// const recruitmentCategoryController = require("../Controllers/recruitmentCategoryController")

// Secondary models
const RecruitmentAreaModel = require("../Models/RecruitmentAreas") // done
const RecruitmentUnityModel = require("../Models/RecruitmentUnity")
const RecruitmentCourseModel = require("../Models/RecruitmentCourse")
const ProjectRecruitmentModel = require("../Models/ProjectRecruitment")




/**
 * gets User ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_available_position FROM Available_position", {
            model: AvailablePositionModel.Available_position
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
 * TODO 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchAvailablePositionByIdEntity = async (dataObj) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Available_position.id_available_position, Available_position.designation_pt as designation, Available_position.desc_html_structure_pt as desc_html_structure, Available_position.pdf_path, Available_position.candidacy_link, Available_position.category_1,Available_position.category_2,Available_position.category_3 FROM Available_position WHERE Available_position.id_entity =:id_entity; ` : `SELECT Available_position.id_available_position, Available_position.designation_eng as designation, Available_position.desc_html_structure_eng as desc_html_structure, Available_position.pdf_path, Available_position.candidacy_link,Available_position.category_1,Available_position.category_2,Available_position.category_3 FROM Available_position WHERE  Available_position.id_entity = :id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: AvailablePositionModel.Available_position
        })
        .then(async data => {
            let availablePositions = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    console.log(el);
                    let categories = [el.category_1, el.category_2, el.category_3]
                    let projectTags = await selectAvailablePositionRelatedProjects(el.id_available_position, dataObj.req.sanitize(dataObj.req.params.lng));
                    let courseTags = await selectAvailablePositionRelatedCourse(el.id_available_position, dataObj.req.sanitize(dataObj.req.params.lng))
                    let areaTags = await selectAvailablePositionRelatedArea(el.id_available_position, dataObj.req.sanitize(dataObj.req.params.lng))
                    let unityTags = await selectAvailablePositionRelatedUnity(el.id_available_position, dataObj.req.sanitize(dataObj.req.params.lng))

                    let positionObj = {
                        id_available_position: el.id_available_position,
                        designation: el.designation,
                        description: el.description,
                        desc_html_structure: el.desc_html_structure,
                        pdf_path: el.pdf_path,
                        candidacy_link: el.candidacy_link,
                        course_tags: courseTags,
                        project_tags: projectTags,
                        area_tags: areaTags,
                        unity_tags: unityTags,
                        categories: categories
                    }

                    availablePositions.push(positionObj)
                }
            }


            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: availablePositions,
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
 * Initialize the table Available_position by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initAvailablePosition = async (dataObj) => {

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
    let randomIds = [uniqueIdPack.generateRandomId('_AvailablePos'), uniqueIdPack.generateRandomId('_AvailablePos')]

    if (dataObj.idUser === null || dataObj.idEntity === null) {

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
    //If success returns the hashed password
    let insertArray = [
        [randomIds[0], `PhD Auxiliary Researcher Contracts`, `PhD Auxiliary Researcher Contracts`, `<p>
        PORTIC is opening new positions for PhD Auxiliar Researcher in the areas of:
        <br>
        <ul wfd-id="429">
          <li wfd-id="432">Digital Systems for Health and Telehealth <span wfd-id="433">Call RDI/01/2021 Information</span>;</li>
          <li wfd-id="430">Cybersecurity <span wfd-id="431">Call RDI/02/2021 Information</span>;</li>
        </ul>
        <br>
        The selected researchers are expected to lead the definition and implementation of the research area strategy, promote and drive research activities leading to a strong publication effort, and lead research funding proposals.
        <br>
        <br>
        <span wfd-id="428">Funding is already available for the research kickstart.</span>
        <br>
        <br>
        PORTIC offers an excellent working environment, with multidisciplinary teams and career development possibilities. The researchers will work in a highly collaborative environment with other members of the center and industry collaborators, in an open and fertile environment.
        <br>
        <br>
        Selected candidates will be employed with a contract of 3 to 6 years, starting tentatively in May/June 2021 (negotiable), with a gross monthly salary of roughly 3200€, following the 14 times per year salary model in Portugal.
        <br>
        <br>
        Applications are made at <a href="https://portal.ipp.pt/concursos/sc/pessoal/" target="_blank">https://portal.ipp.pt/concursos/sc/pessoal/</a> no later than March 31st.
        <ul wfd-id="425">
          <li wfd-id="427">Digital Systems for Health and Telehealth: <u>two positions open with references PORTIC-01-2021 and PORTIC-02-2021.</u>;</li>
          <li wfd-id="426">Cybersecurity <u>one position open with reference PORTIC-03-2021</u></li>
        </ul>
        <br>
        Guide for applications (English): <a href="https://www.portic.ipp.pt/positions/Instructions to apply.pdf" target="_blank">https://www.portic.ipp.pt/positions/Instructions to apply.pdf</a>
        <br>
        <br>
        <span wfd-id="424">Candidates can send an email with a brief CV, motivation statement identifying the area and foreseen research topics, to jobs@portic.ipp.pt, no later than March 28th, 2021, for support with the application process.</span>
        </p>`, `<p>
        PORTIC is opening new positions for PhD Auxiliar Researcher in the areas of:
        <br>
        <ul wfd-id="429">
          <li wfd-id="432">Digital Systems for Health and Telehealth <span wfd-id="433">Call RDI/01/2021 Information</span>;</li>
          <li wfd-id="430">Cybersecurity <span wfd-id="431">Call RDI/02/2021 Information</span>;</li>
        </ul>
        <br>
        The selected researchers are expected to lead the definition and implementation of the research area strategy, promote and drive research activities leading to a strong publication effort, and lead research funding proposals.
        <br>
        <br>
        <span wfd-id="428">Funding is already available for the research kickstart.</span>
        <br>
        <br>
        PORTIC offers an excellent working environment, with multidisciplinary teams and career development possibilities. The researchers will work in a highly collaborative environment with other members of the center and industry collaborators, in an open and fertile environment.
        <br>
        <br>
        Selected candidates will be employed with a contract of 3 to 6 years, starting tentatively in May/June 2021 (negotiable), with a gross monthly salary of roughly 3200€, following the 14 times per year salary model in Portugal.
        <br>
        <br>
        Applications are made at <a href="https://portal.ipp.pt/concursos/sc/pessoal/" target="_blank">https://portal.ipp.pt/concursos/sc/pessoal/</a> no later than March 31st.
        <ul wfd-id="425">
          <li wfd-id="427">Digital Systems for Health and Telehealth: <u>two positions open with references PORTIC-01-2021 and PORTIC-02-2021.</u>;</li>
          <li wfd-id="426">Cybersecurity <u>one position open with reference PORTIC-03-2021</u></li>
        </ul>
        <br>
        Guide for applications (English): <a href="https://www.portic.ipp.pt/positions/Instructions to apply.pdf" target="_blank">https://www.portic.ipp.pt/positions/Instructions to apply.pdf</a>
        <br>
        <br>
        <span wfd-id="424">Candidates can send an email with a brief CV, motivation statement identifying the area and foreseen research topics, to jobs@portic.ipp.pt, no later than March 28th, 2021, for support with the application process.</span>
        </p>`, `https://portal.ipp.pt/concursos/sc/pessoal/`, dataObj.idEntity, `cybersecurity`, ` Digital Systems for Health and Telehealth`, null],


        [randomIds[1], `Scholarships`, `Scholarships`, `<p>
         <span wfd-id="441">Forthcoming</span>
         PORTIC intends to open new positions for PhD and master students in the areas of:
         <ul wfd-id="438">
           <li wfd-id="440">Cybersecurity;</li>
           <li wfd-id="439">Health Technologies</li>
         </ul>
         <br>
         Information about these positions will be made available soon. If wanting to ask for more information, or send a spontaneous application, contact at <a href="mailto:jobs@portic.ipp.pt" target="_blank">jobs@portic.ipp.pt</a>.
         </p>`, `<p>
         <span wfd-id="441">Forthcoming</span>
         PORTIC intends to open new positions for PhD and master students in the areas of:
         <ul wfd-id="438">
           <li wfd-id="440">Cybersecurity;</li>
           <li wfd-id="439">Health Technologies</li>
         </ul>
         <br>
         Information about these positions will be made available soon. If wanting to ask for more information, or send a spontaneous application, contact at <a href="mailto:jobs@portic.ipp.pt" target="_blank">jobs@portic.ipp.pt</a>.
         </p>`, `https://portal.ipp.pt/concursos/sc/pessoal/`, dataObj.idEntity, `Health Technologies`, ` Digital Systems for Health and Telehealth`, null]
    ]
    await sequelize
        .query(
            `INSERT INTO Available_position(id_available_position,designation_pt,designation_eng,desc_html_structure_pt,desc_html_structure_eng,candidacy_link,id_entity,category_1,category_2,category_3) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: AvailablePositionModel.Available_position
            }
        )
        .then(async data => {

            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }


            // let firstCatId = (await categoryController.fetchCategoryIdByDesignation("Digital Systems for Health and Telehealth")).toClient.processResult[0].id_category
            // let secondCatId = (await categoryController.fetchCategoryIdByDesignation("Cibersecurity")).toClient.processResult[0].id_category
            // let thirdCatId = (await categoryController.fetchCategoryIdByDesignation("Health Technologies")).toClient.processResult[0].id_category
            // console.log(firstCatId);
            // let insertArray = await [
            //     [randomIds[0], firstCatId],
            //     [randomIds[0], secondCatId],
            //     [randomIds[1], secondCatId],
            //     [randomIds[1], thirdCatId],
            // ]
            // let result = await recruitmentCategoryController.initAddRecruitmentCategory({
            //     insertArray: insertArray,
            //     exist: false
            // })

            // if (result.processRespCode !== 201) {
            //     processResp.toClient.processMsg += ` ,except the available positions categories.`

            // } else {
            //     processResp.toClient.processMsg += `.`
            // }
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
 * Fetches all Menus 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchAvailablePositions = (req, callback) => {
    sequelize
        .query("SELECT * FROM Available_position", {
            model: AvailablePositionModel.Available_position
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


// /**
//  * Todo
//  * @param {String} id_area id of the area that we want the tags
//  */
const selectAvailablePositionRelatedUnity = async (id_available_position, lng) => {
    let processResp = {}
    let query = `SELECT Unity.id_unity, Unity.designation FROM(((  Recruitment_unity  inner Join 
        Unity on Unity.id_unity= Recruitment_unity.id_unity)
        Inner Join
        Available_position on Available_position.id_available_position= Recruitment_unity.id_available_position)
        Inner Join
        Data_Status on Data_Status.id_status= Unity.id_status)  where Data_Status.designation= 'Published' and   Available_position.id_available_position =:id_available_position`
    await sequelize
        .query(query, {
            replacements: {
                id_available_position: id_available_position
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


const selectAvailablePositionRelatedCourse = async (id_available_position, lng) => {
    let processResp = {}
    let query = `SELECT Course.id_course, Course.designation FROM(((  Recruitment_course  inner Join 
        Course on Course.id_course= Recruitment_course.id_course)
        Inner Join
        Available_position on Available_position.id_available_position= Recruitment_course.id_available_position)
        Inner Join
        Data_Status on Data_Status.id_status= Course.id_status)  where Data_Status.designation= 'Published' and Available_position.id_available_position=:id_available_position`

    await sequelize
        .query(query, {
            replacements: {
                id_available_position: id_available_position
            }
        }, {
            model: RecruitmentCourseModel.Recruitment_course
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



const selectAvailablePositionRelatedArea = async (id_available_position, lng) => {
    let processResp = {}
    let query = (lng === 'pt') ? `SELECT Area.id_area, Area.designation_pt as designation FROM((  Recruitment_area  inner Join 
        Available_position on Available_position.id_available_position= Recruitment_area.id_available_position)
        Inner Join
        Area on Area.id_area = Recruitment_area.id_area) where  Available_position.id_available_position=:id_available_position` : `SELECT Area.id_area, Area.designation_eng as designation FROM((  Recruitment_area  inner Join 
        Available_position on Available_position.id_available_position= Recruitment_area.id_available_position)
        Inner Join
        Area on Area.id_area = Recruitment_area.id_area) where  Available_position.id_available_position=:id_available_position`

    await sequelize
        .query(query, {
            replacements: {
                id_available_position: id_available_position
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

const selectAvailablePositionRelatedProjects = async (id_available_position, lng) => {
    let processResp = {}
    let query = `SELECT Project.id_project, Project.title FROM(( ( Project_recruitment inner Join 
        Project on Project.id_project= Project_recruitment.id_project)
        Inner Join
        Available_position on Available_position.id_available_position = Project_recruitment.id_available_position) 
        Inner Join
        Data_Status on Data_Status.id_status= Project.id_status)  where Data_Status.designation= 'Published' and Available_position.id_available_position=:id_available_position`

    await sequelize
        .query(query, {
            replacements: {
                id_available_position: id_available_position
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





// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Admin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



/**
 * Add Area   
 * StatusCompleted
 */
const addAvailable = async (dataObj) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null || !dataObj.req.sanitize(dataObj.req.body.designation_pt) || !dataObj.req.sanitize(dataObj.req.body.designation_eng) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt)) {
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
    let insertArray = [
        [uniqueIdPack.generateRandomId('_AvailablePos'), dataObj.req.sanitize(dataObj.req.body.designation_pt), dataObj.req.sanitize(dataObj.req.body.designation_eng), dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt), dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng), ((!dataObj.req.sanitize(dataObj.req.body.pdf_path)) ? null : dataObj.req.sanitize(dataObj.req.body.pdf_path)), ((!dataObj.req.sanitize(dataObj.req.body.candidacy_link)) ? null : dataObj.req.sanitize(dataObj.req.body.candidacy_link)), dataObj.idEntity, ((!dataObj.req.sanitize(dataObj.req.body.category_1)) ? null : dataObj.req.sanitize(dataObj.req.body.category_1)), ((!dataObj.req.sanitize(dataObj.req.body.category_2)) ? null : dataObj.req.sanitize(dataObj.req.body.category_2)), ((!dataObj.req.sanitize(dataObj.req.body.category_3)) ? null : dataObj.req.sanitize(dataObj.req.body.category_3))],
    ]
    await sequelize
        .query(
            `INSERT INTO Available_position(id_available_position,designation_pt,designation_eng,desc_html_structure_pt,desc_html_structure_eng,pdf_path,candidacy_link,id_entity,category_1,category_2,category_3) VALUES  ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: AvailablePositionModel.Available_position
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
 *Fetches Available Positions based in an admin level
 Status: Completed
 */
const fetchAvailablePositionByAdmin = async (dataObj) => {
    let processResp = {}
    let query = await (dataObj.user_level === `Super Admin`) ? `SELECT Available_position.id_available_position, Available_position.designation_pt ,Available_position.designation_eng   ,Available_position.desc_html_structure_pt , Available_position.desc_html_structure_eng,Available_position.pdf_path, Available_position.candidacy_link,Available_position.created_at, Entity.initials, Available_position.category_1,Available_position.category_2,Available_position.category_3 
    FROM (Available_position 
    INNER JOIN Entity On Entity.id_entity = Available_position.id_entity);` : `SELECT Available_position.id_available_position, Available_position.designation_pt ,Available_position.designation_eng   ,Available_position.desc_html_structure_pt , Available_position.desc_html_structure_eng,Available_position.pdf_path, Available_position.candidacy_link,Available_position.created_at, Entity.initials
    FROM (Available_position
    INNER JOIN Entity On Entity.id_entity = Available_position.id_entity) Where Available_position.id_entity = :id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: AvailablePositionModel.Available_position
        })
        .then(async data => {
            let availablePositions = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let categories = [el.category_1, el.category_2, el.category_3]
                    let projectTags = await selectAvailablePositionRelatedProjects(el.id_available_position, "pt");
                    let courseTags = await selectAvailablePositionRelatedCourse(el.id_available_position, "pt")
                    let areaTags = await selectAvailablePositionRelatedArea(el.id_available_position, "pt")
                    let unityTags = await selectAvailablePositionRelatedUnity(el.id_available_position, "pt")

                    let positionObj = {
                        id_available_position: el.id_available_position,
                        designation_pt: el.designation_pt,
                        description_pt: el.description_pt,
                        designation_eng: el.designation_eng,
                        desc_html_structure_pt: el.desc_html_structure_pt,
                        desc_html_structure_eng: el.desc_html_structure_eng,
                        desc_html_structure: el.desc_html_structure,
                        pdf_path: el.pdf_path,
                        candidacy_link: el.candidacy_link,
                        created_at: el.created_at,
                        entity_initials: el.initials,
                        course_tags: courseTags,
                        project_tags: projectTags,
                        area_tags: areaTags,
                        unity_tags: unityTags,
                        categories: categories
                    }

                    availablePositions.push(positionObj)
                }
            }


            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: availablePositions,
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
 * edit user profile fields present in  
 * Status: Complete
 */
const editAvailablePosition = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.designation_pt) || !dataObj.req.sanitize(dataObj.req.body.designation_eng) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng)) {
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
            `UPDATE Available_position SET designation_pt=:designation_pt,designation_eng=:designation_eng, desc_html_structure_pt =:desc_html_structure_pt, desc_html_structure_eng =:desc_html_structure_eng, pdf_path=:pdf_path,candidacy_link=:candidacy_link  Where Available_position.id_available_position=:id_available_position`, {
                replacements: {
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id),
                    designation_pt: dataObj.req.sanitize(dataObj.req.body.designation_pt),
                    designation_eng: dataObj.req.sanitize(dataObj.req.body.designation_eng),
                    category_1: dataObj.req.sanitize(dataObj.req.body.category_1),
                    category_2: dataObj.req.sanitize(dataObj.req.body.category_2),
                    category_3: dataObj.req.sanitize(dataObj.req.body.category_3),
                    desc_html_structure_pt: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_pt),
                    desc_html_structure_eng: dataObj.req.sanitize(dataObj.req.body.desc_html_structure_eng),
                    pdf_path: (!dataObj.req.body.pdf_path) ? null : dataObj.req.sanitize(dataObj.req.body.pdf_path),
                    candidacy_link: (!dataObj.req.sanitize(dataObj.req.body.candidacy_link)) ? null : dataObj.req.sanitize(dataObj.req.body.candidacy_link),
                }
            }, {
                model: AvailablePositionModel.Available_position
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The position was updated successfully",
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
 * Delete Media  
 * StatusCompleted
 */
const deleteAvailablePosition = async (dataObj) => {
    let processResp = {}
    let query = `
    DELETE FROM Available_position Where id_available_position=:id_available_position;
DELETE FROM Recruitment_category where id_available_position =:id_available_position;
DELETE FROM Project_recruitment where id_available_position =:id_available_position;
DELETE FROM Recruitment_area where id_available_position =:id_available_position;
DELETE FROM Recruitment_course where id_available_position =:id_available_position;
DELETE FROM Recruitment_unity where id_available_position =:id_available_position;
 `
    await sequelize
        .query(
            query, {
                replacements: {
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id)
                },
                dialectOptions: {
                    multipleStatements: true
                },
            },
        )
        .then(data => {
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


















module.exports = {
    fetchAvailablePositionByIdEntity,
    initAvailablePosition,
    fetchAvailablePositions,
    // 
    addAvailable,
    deleteAvailablePosition,
    editAvailablePosition,
    fetchAvailablePositionByAdmin
}