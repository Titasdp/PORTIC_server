//Models
const EntityAreasFocusModel = require("../Models/EntityAreasFocus")
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
const fetchAreaFocusByIdEntity = async (dataObj, callback) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_pt as description, Picture.img_path from  (Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon) WHERE Entity_Areas_focus.id_entity =:id_entity;` : `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_eng as description, Picture.img_path from  (Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon) WHERE Entity_Areas_focus.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityAreasFocusModel.Entity_areas_focus
        })
        .then(async data => {
            let areasFocus = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)

                    let areaFocusObj = {
                        id_areas_focus: el.id_areas_focus,
                        description: el.description,
                        img: await (imgFetch.processRespCode === 200) ? imgFetch.toClient.processResult : [],

                    }
                    areasFocus.push(areaFocusObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: areasFocus,
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
 * @param {Callback} callback 
 * @returns 
 */
const initAreaFocus = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idCreator === null || dataObj.idEntity === null || dataObj.imgsIds.length !== 6) {

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
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Procura e desenvolvimento`, `Search and development`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[0]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Tecnologia e partilha de conhecimentos`, `Technology and knowledge sharing`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[1]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Inovação e criatividade`, `Innovation and creativity`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[2]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Empreendedorismo`, `Entrepreneurship`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[3]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Incubação tecnológica`, `Technology incubation`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[4]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Startups e spin-offs`, `Startups and spin-offs`, dataObj.idCreator, dataObj.idEntity, dataObj.imgsIds[5]],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_Areas_focus(id_areas_focus,description_pt,description_eng,id_creator,id_entity,id_icon) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityAreasFocusModel.Entity_areas_focus
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
const fetchAreaFocus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_Areas_focus", {
            model: EntityAreasFocusModel.Entity_areas_focus
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
    initAreaFocus,
    fetchAreaFocus,
    fetchAreaFocusByIdEntity,

}