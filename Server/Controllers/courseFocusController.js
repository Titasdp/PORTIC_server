//Models
const EntityCourseFocusModel = require("../Models/EntityCoursesFocus")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")
// Controllers 
const pictureController = require("../Controllers/pictureController")


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_courses_focus FROM Entity_courses_focus", {
            model: EntityCourseFocusModel.Entity_courses_focus
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
const fetchCourseFocusByIdEntity = async (dataObj, callback) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `Select Entity_courses_focus.id_courses_focus, Entity_courses_focus.description_pt as description, Picture.img_path from  (Entity_courses_focus INNER JOIN Picture ON Picture.id_picture = Entity_courses_focus.id_icon) WHERE Entity_courses_focus.id_entity =:id_entity` : `Select Entity_courses_focus.id_courses_focus, Entity_courses_focus.description_eng as description, Picture.img_path from  (Entity_courses_focus INNER JOIN Picture ON Picture.id_picture = Entity_courses_focus.id_icon) WHERE Entity_courses_focus.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityCourseFocusModel.Entity_courses_focus
        })
        .then(async data => {
            let coursesFocus = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)

                    let courseFocusObj = {
                        id_courses_focus: el.id_courses_focus,
                        description: el.description,
                        img: await (imgFetch.processRespCode === 200) ? imgFetch.toClient.processResult : [],
                    }
                    coursesFocus.push(courseFocusObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: coursesFocus,
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

/**
 * Initialize the table CorseFocus by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 */
const initCorseFocus = async (dataObj) => {
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
    if (dataObj.idCreator === null || dataObj.idEntity === null) {

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

    let imgsInitResult = await pictureController.initAddMultipleImgs({
        insertArray: [`${process.cwd()}/Server/Images/Icons/student.svg`, `${process.cwd()}/Server/Images/Icons/diversity.svg`, `${process.cwd()}/Server/Images/Icons/international.svg`, `${process.cwd()}/Server/Images/Icons/companies.png`, `${process.cwd()}/Server/Images/Icons/prototype.svg`]
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
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Licenciatura, mestrado, pós-graduação, doutoramento e pós-doc.`, `Undergraduate, master's, graduate, doctorate and post-doc.`, dataObj.idCreator, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[0]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Engenharia, design, comunicação, ciências empresariais, educação, etc.`, `Engineering, design, communication, business sciences, education, etc.`, dataObj.idCreator, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[1]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Propostas feitas por parceiros empresariais nacionais e internacionais.`, `Proposals made by national and international business partners.`, dataObj.idCreator, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[2]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Contacto com empresas e clientes.`, `Contact with companies and clients.`, dataObj.idCreator, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[3]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Processos de needfinding, idealização e prototipagem.`, `Processes of needfinding, idealization and prototyping.`, dataObj.idCreator, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[4]],

    ]
    await sequelize
        .query(
            `INSERT INTO Entity_courses_focus(id_courses_focus,description_pt,description_eng,id_creator,id_entity,id_icon) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityCourseFocusModel.Entity_courses_focus
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
 * Fetches all HiringTips 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchCourseFocus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_courses_focus", {
            model: EntityCourseFocusModel.Entity_courses_focus
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


module.exports = {
    initCorseFocus,
    fetchCourseFocus,
    fetchCourseFocusByIdEntity

}