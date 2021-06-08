//Models
const EntityCourseFocusModel = require("../Models/EntityCoursesFocus")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")



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
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)

                    let courseFocusObj = {
                        id_courses_focus: el.id_courses_focus,
                        description: el.description,
                        description: el.description,
                        img: await (imgFetch.processRespCode === 200) ? imgFetch.toClient.processResult : [],

                    }
                    coursesFocus.push(courseFocusObj)
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
            return callback(false, processResp)
        });
};

/**
 * Initialize the table CorseFocus by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initCorseFocus = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idCreator === null || dataObj.idEntity === null || dataObj.imgsIds.length !== 5) {

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
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Licenciatura, mestrado, pós-graduação, doutoramento e pós-doc.`, `Undergraduate, master's, graduate, doctorate and post-doc.`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[0]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Engenharia, design, comunicação, ciências empresariais, educação, etc.`, `Engineering, design, communication, business sciences, education, etc.`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[1]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Propostas feitas por parceiros empresariais nacionais e internacionais.`, `Proposals made by national and international business partners.`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[2]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Contacto com empresas e clientes.`, `Contact with companies and clients.`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[3]],
        [uniqueIdPack.generateRandomId('_CourseFocus'), `Processos de needfinding, idealização e prototipagem.`, `Processes of needfinding, idealization and prototyping.`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[4]],

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