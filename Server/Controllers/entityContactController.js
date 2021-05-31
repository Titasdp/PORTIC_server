const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const EntityContactModel = require("../Models/EntityContact")

/**
 * Initialize the table Entity_contact by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntityContact = async (dataObj, callback) => {
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
        [uniqueIdPack.generateRandomId('_Contact'), "(+351) 22 557 1020", dataObj.idEntity, dataObj.idUser, dataObj.communicationLevels[0].dataValues.id_communication_level],
    ]
    sequelize
        .query(
            `INSERT INTO Entity_contact (id_contact , number , id_entity , id_creator , id_communication_level) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityContactModel.Entity_contact
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
 * Fetches all entities contact 
 * Status: Completed
 * Obj: It may be useful in fewer occasions
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchContacts = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_contact", {
            model: EntityContactModel.Entity_contact
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
 * Fetches all Contacts from an entity 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchEntityContacts = (dataObj, callback) => {
    let query = `SELECT Entity_contact.number, Communication_level.designation as communicationl_level FROM ( Entity_contact inner Join 
        Communication_level on Entity_contact.id_communication_level = Communication_level.id_communication_level)
       where Entity_contact.id_entity = :id_entity;`
    sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityContactModel.Entity_contact
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
    initEntityContact,
    fetchContacts,
    fetchEntityContacts
}