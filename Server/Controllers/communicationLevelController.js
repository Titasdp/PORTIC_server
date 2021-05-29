const CommunicationLevelModel = require("../Models/CommunicationLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all CommunicationLevel from the Database
 * Status: Completed
 * @param {Req} req Request sended by the client to the server
 * @param {Callback} callback 
 */
const fetchCommunicationLevels = (req, callback) => {
    sequelize
        .query("SELECT * FROM Communication_level", {
            model: CommunicationLevelModel.Communication_level
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
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};



/**
 * Initialize communication level by introducing data to the table
 * Status: completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 */
const initCommunicationLevel = (dataObj, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_ComLevel'), 'Primary'],
        [uniqueIdPack.generateRandomId('_ComLevel'), 'Secondary'],
    ]
    sequelize
        .query(
            `INSERT INTO Communication_level (id_communication_level,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CommunicationLevelModel.Communication_level
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created.",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};
/**
 * Fetches Communication level data based on the designation 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchCommunicationLevelByDesignation = (designation, callback) => {
    sequelize
        .query("SELECT * FROM Communication_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CommunicationLevelModel.Communication_level
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
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};



module.exports = {
    fetchCommunicationLevels,
    initCommunicationLevel,
    fetchCommunicationLevelByDesignation
}