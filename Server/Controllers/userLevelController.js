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
initUserLevel = (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Super Admin'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Entity Admin'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Collaborator'],
    ]
    sequelize
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
 * Function that returns UserLevel id based on designation
 * Done
 */
const fetchUserLevelIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_user_level FROM User_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: UserLevelModel.User_level
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
    fetchUserStatus,
    initUserLevel,
    fetchUserLevelIdByName
}