const DataStatusModel = require("../Models/DataStatus")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all dataStatus from the Database
 * Done
 */
getAllDataStatus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Data_Status", {
            model: DataStatusModel.Data_status
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
 * Function that adds predefined DataStratus elements to the table
 * Done
 */
initDataStatus = (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Created'],
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Published'],
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Archived'],
    ]
    sequelize
        .query(
            `INSERT INTO Data_Status (id_status,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: DataStatusModel.Data_status
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully",
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
 * Function that returns dataStatus id based on designation
 * Done
 */
getDataStatusIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_status FROM Data_Status where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: DataStatusModel.Data_status
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
    getAllDataStatus,
    initDataStatus,
    getDataStatusIdByName
}