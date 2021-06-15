const CommunicationLevelModel = require("../Models/CommunicationLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_communication_level FROM Communication_level", {
            model: CommunicationLevelModel.Communication_level
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
 * Initialize communication level by introducing data to the table
 * Status: completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 */
const initCommunicationLevel = async () => {
    let processResp = {};
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
        [uniqueIdPack.generateRandomId('_ComLevel'), 'Primary'],
        [uniqueIdPack.generateRandomId('_ComLevel'), 'Secondary'],
    ]
    await sequelize
        .query(
            `INSERT INTO Communication_level (id_communication_level,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CommunicationLevelModel.Communication_level
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
                    processResult: false,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
};

const fetchCommunicationLevelByDesignation = async (designation) => {
    let processResp = {}
    await sequelize
        .query("SELECT * FROM Communication_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CommunicationLevelModel.Communication_level
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



module.exports = {
    initCommunicationLevel,
    fetchCommunicationLevelByDesignation
}