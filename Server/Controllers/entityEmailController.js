const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const EntityEmailModel = require("../Models/EntityEmail")
//Controllers
const communicationLevelController = require("../Controllers/communicationLevelController")





const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_email FROM Entity_email", {
            model: EntityEmailModel.Entity_email
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
 * Initialize the table Entity_email by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntityEmail = async (dataObj) => {

    let primaryLevelId = (await communicationLevelController.fetchCommunicationLevelByDesignation("Primary")).toClient.processResult[0].id_communication_level;
    let secondaryLevelId = (await communicationLevelController.fetchCommunicationLevelByDesignation("Secondary")).toClient.processResult[0].id_communication_level;

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

    if (dataObj.idEntity === null || dataObj.idUser === null || primaryLevelId == null || secondaryLevelId == null) {
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
        [uniqueIdPack.generateRandomId('_Email'), "portic@portic.ipp.pt", dataObj.idEntity, dataObj.idUser, primaryLevelId],
        [uniqueIdPack.generateRandomId('_Email'), "communication@portic.ipp.pt", dataObj.idEntity, dataObj.idUser, secondaryLevelId],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_email (id_email , email , id_entity , id_creator , id_communication_level) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityEmailModel.Entity_email
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
 * Fetches all Pages 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchEmails = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_email", {
            model: EntityEmailModel.Entity_email
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
 * Fetches all entity emails 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchEntityEmails = (dataObj, callback) => {
    let query = `SELECT Entity_email.email, Communication_level.designation as communication_level FROM ( Entity_email inner Join 
        Communication_level on Entity_email.id_communication_level = Communication_level.id_communication_level)
       where Entity_email.id_entity =:id_entity;`
    sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityEmailModel.Entity_email
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            let processResp = {
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
    initEntityEmail,
    fetchEmails,
    fetchEntityEmails
}