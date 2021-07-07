const UserLevelModel = require("../Models/UserLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
const {
    User
} = require("../Models/User");


/**
 * gets UserLevel ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_user_level FROM User_level", {
            model: UserLevelModel.User_level
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
 * inits the user UserLevel by adding predefine data
 * Status:Completed
 * @returns (data obj with multiple params )
 */
const initUserLevel = async () => {
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
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Super Admin'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Coord. Entidade'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Coord. projeto'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Coord. curso'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Coord. global'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Admin global'],
        [uniqueIdPack.generateRandomId('_UserLevel'), 'Undefine'],
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
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: true,
                    processError: null,
                    processMsg: "All the data were successfully created.",
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
};




/**
 * Function that returns UserLevel id based on designation
 * Done
 */
const fetchUserLevelIdByDesignation = async (designation) => {

    let processResp = {}
    await sequelize
        .query("SELECT id_user_level FROM User_level where designation =:designation", {
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
const fetchAllUserLevelDesignation = async () => {
    let processResp = {}
    await sequelize
        .query("SELECT User_level.designation FROM User_level", {
            model: UserLevelModel.User_level
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
    initUserLevel,
    fetchUserLevelIdByDesignation,
    //
    fetchAllUserLevelDesignation
}