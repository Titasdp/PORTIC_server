const UserLevelModel = require("../Models/UserLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all UserLevel from the Database
 * Done
 */
fetchUserStatus = (req, callback) => {
    sequelize
        .query("SELECT * FROM User_status", {
            model: UserLevelModel.User_level
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
 * Function that adds predefined UserLevel elements to the table
 * Done
 */
initializeUserLevel = async (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Super Admin'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Entity Admin'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Collaborator'],
    ]
    await sequelize
        .query(
            `INSERT INTO User_level (id_user_level,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserLevelModel.User_level
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created",
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
 * Function that returns UserLevel id based on designation
 * Done
 */
getUserStatusIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_status FROM User_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: UserLevelModel.User_level
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
    getAllUserStatus,
    initializeUserStatus,
    getUserStatusIdByName
}