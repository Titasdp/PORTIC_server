const CommunicationLevelModel = require("../Models/CommunicationLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all CommunicationLevel from the Database
 * Done
 */
fetchCommunicationLevels = (req, callback) => {
    sequelize
        .query("SELECT * FROM Communication_level", {
            model: CommunicationLevelModel.Communication_level
        })
        .then(data => {
            let processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Fetched successfully",
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
 * Function that adds predefined CommunicationLevel elements to the table
 * Done
 */
initCommunicationLevel = (req, callback) => {
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
 * Function that returns CommunicationLevel id based on designation
 * Done
 */
fetchCommunicationLevelIdByDes = (designation, callback) => {
    sequelize
        .query("SELECT id_communication_level FROM Communication_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CommunicationLevelModel.Communication_level
        })
        .then(data => {
            let processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Fetched successfully",
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
    fetchCommunicationLevelIdByDes
}