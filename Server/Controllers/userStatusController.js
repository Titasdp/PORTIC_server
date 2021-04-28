const UserStatusModel = require("../Models/UserStatus")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all UserStatus from the Database
 * Done
 */
getAllUserStatus = (req, callback) => {
    sequelize
        .query("SELECT * FROM User_status", {
            model: UserStatusModel.User_status
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
 * Function that adds predefined UserStratus elements to the table
 * Done
 */
initializeUserStatus = async (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Normal'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Blocked'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Archived'],
    ]
    await sequelize
        .query(
            `INSERT INTO User_status (id_status,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserStatusModel.User_status
            }
        )
        .then(data => {
            console.log("Maria");
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            console.log(error);
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
 * Function that returns UserStatus id based on designation
 * Done
 */
getUserStatusIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_status FROM User_status where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: UserStatusModel.User_status
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