const DataStatusModel = require("../Models/DataStatus")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")







const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_status FROM Data_Status", {
            model: DataStatusModel.Data_status
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
const initDataStatus = async () => {

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
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Created'],
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Published'],
        [uniqueIdPack.generateRandomId('_DataStatus'), 'Archived'],
    ]
    await sequelize
        .query(
            `INSERT INTO Data_Status (id_status,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: DataStatusModel.Data_status
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
};


// Todo 
const fetchDataStatusIdByDesignation = async (designation) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_status FROM Data_Status where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: DataStatusModel.Data_status
        })
        .then(data => {
            console.log("Inside data:");
            console.log(data);
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





// Todo 
const fetchAllDataStatus = async () => {
    let processResp = {}
    await sequelize
        .query("SELECT id_status, designation FROM Data_Status", {
            model: DataStatusModel.Data_status
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
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
    // getAllDataStatus,
    initDataStatus,
    // fetchDataStatusIdByName,
    fetchDataStatusIdByDesignation,
    fetchAllDataStatus
}