const UserStatusModel = require("../Models/UserStatus")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");

/**
 * gets User Status ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_status FROM User_status", {
            model: UserStatusModel.User_status
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
 * inits the user StatusTable by adding predefine data
 * @returns (data obj with multiple params )
 */
const initUserStatus = async () => {
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

    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Normal'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Blocked'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Archived'],
        [uniqueIdPack.generateRandomId('_UserStatus'), 'Pendent Creation'],
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
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: true,
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
                    processResult: false,
                    processError: null,
                    processMsg: "Something went wrong, please try again.",
                }
            }

        });
    return processResp
};



/**
 * Fetch userStatus id based on his name
 * Status:Completed
 * @param {String} designation Name of the status

 */
const fetchUserStatusIdByDesignation = async (designation) => {
    await sequelize
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
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp
};





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!New!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
/**
 * Fetches all user Level Designation from the database
 * Status:Completed
 * @returns obj of data
 */
const fetchAllUserStatusDesignation = async () => {
    let processResp = {}
    await sequelize
        .query("SELECT User_status.designation FROM User_status", {
            model: UserStatusModel.User_status
        })
        .then(data => {
            let respMsg = "Fetch successfully."
            if (data.length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp
};




module.exports = {
    initUserStatus,
    fetchUserStatusIdByDesignation,

    // 
    fetchAllUserStatusDesignation
}