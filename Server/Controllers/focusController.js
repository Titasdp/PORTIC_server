//Models
const FocusModel = require("../Models/Focus")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")



const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_focus FROM Focus", {
            model: FocusModel.Focus
        })
        .then(data => {
            respCode = 200;
            if (data[0].length === 0) {
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
const fetchEntityFocusByIdEntity = async (dataObj, callback) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Focus.id_focus, Focus.description_pt as description From Focus WHERE Focus.id_entity =:id_entity` : `SELECT Focus.id_focus, Focus.description_eng as description From Focus WHERE Focus.id_entity =:id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: FocusModel.Focus
        })
        .then(async data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
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
 * Initialize the table Focus by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 */
const initFocus = async (dataObj) => {
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
        [uniqueIdPack.generateRandomId('_Focus'), `Elevada qualidade de trabalho`, `High quality of work`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Focus'), `Qualidade da comunicação`, `Quality of communication`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Focus'), `Assegurar o sucesso dos clientes`, `Ensuring customer success`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Focus'), `Grande variedade de tecnologias`, `Wide variety of technologies`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Focus'), `Respeitamos as deadlines`, `Respecting deadlines`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Focus'), `Iniciativa e proatividade`, `Initiative and proactivity`, dataObj.idUser, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Focus(id_focus,description_pt,description_eng,id_creator,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: FocusModel.Focus
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
 * Fetches all Focus 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchFocus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Focus", {
            model: FocusModel.Focus
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
    initFocus,
    fetchFocus,
    fetchEntityFocusByIdEntity

}