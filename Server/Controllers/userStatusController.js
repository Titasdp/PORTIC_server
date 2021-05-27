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
const initUserStatus = (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Normal'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Blocked'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Archived'],
    ]
    sequelize
        .query(
            `INSERT INTO User_status (id_status,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserStatusModel.User_status
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};



/**
 * Fetch userStatus id based on his name
 * Status:Completed
 * @param {String} designation Name of the status
 * @param {Callback} callback 
 */
const fetchUserStatusIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_status FROM User_status where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: UserStatusModel.User_status
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
    getAllUserStatus,
    initUserStatus,
    fetchUserStatusIdByName
}