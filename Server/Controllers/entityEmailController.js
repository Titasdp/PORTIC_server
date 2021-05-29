const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const EntityEmailModel = require("../Models/EntityEmail")

/**
 * Initialize the table Entity_email by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntityEmail = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.communicationLevels.length === 0 || dataObj.idEntity === null || dataObj.idUser === null) {
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


    console.log(dataObj.communicationLevels[1].dataValues.id_communication_level);
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Email'), "portic@portic.ipp.pt", dataObj.idEntity, dataObj.idUser, dataObj.communicationLevels[0].dataValues.id_communication_level],
        [uniqueIdPack.generateRandomId('_Email'), "communication@portic.ipp.pt", dataObj.idEntity, dataObj.idUser, dataObj.communicationLevels[1].dataValues.id_communication_level],
    ]
    sequelize
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






















module.exports = {
    initEntityEmail,
    fetchEmails
}