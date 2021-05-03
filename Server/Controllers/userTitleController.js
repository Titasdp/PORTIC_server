const UserTitleModel = require("../Models/UserTitle")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all UserTitle from the Database
 * Done
 */
fetchAllUserStatus = (req, callback) => {
    sequelize
        .query("SELECT * FROM User_title", {
            model: UserTitleModel.User_title
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
 * Function that adds predefined UserTitle elements to the table
 * Done
 */
initUserTitle = async (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserTitle'), 'Indefinido', 'Not Defined']
    ]
    await sequelize
        .query(
            `INSERT INTO User_title (id_title,designation_pt,designation_eng) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserTitleModel.User_title
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
 * Function that adds a new user title elements to the system
 * Done
 */
addUserTitle = (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserTitle'), req.sanitize(req.body.designation_pt), req.sanitize(req.body.designation_eng)]
    ]
    sequelize
        .query(
            `INSERT INTO User_title (id_title,designation_pt,designation_eng) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserTitleModel.User_title
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new user title was added to the system.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};

/**
 * Function that gets an user title by email
 * Done
 */
getUserLevelByDesignation = (receivedObj, callback) => {
    let query = ""
        (receivedObj.selected_lang = "eng") ? query = `SELECT * FROM User_title where designation_eng = :designation_eng` : query = `SELECT * FROM User_title where designation_pt = :designation_pt`;
    sequelize
        .query(query, {
            replacements: {
                designation_pt: receivedObj.designation_pt,
                designation_eng: receivedObj.designation_eng
            }
        }, {
            model: UserTitleModel.User_title
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
    fetchAllUserStatus,
    initUserTitle,

    // 
    addUserTitle,
    getUserLevelByDesignation
}