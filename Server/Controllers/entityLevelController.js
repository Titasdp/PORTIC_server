const EntityLevelModel = require("../Models/EntityLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")



/**
 * gets entityLevel ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_entity_level FROM Entity_level", {
            model: EntityLevelModel.Entity_level
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
 * 
 * Status:Completed
 * @returns 
 */
const initEntityLevel = async () => {
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
        [uniqueIdPack.generateRandomId('_EntityLevel'), 'Primary'],
        [uniqueIdPack.generateRandomId('_EntityLevel'), 'Secondary'],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_level (id_entity_level, designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityLevelModel.Entity_level
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
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
        });
    return processResp

};

const fetchEntityLevelIdByDesignation = async (designation) => {
    await sequelize
        .query("SELECT id_entity_level FROM Entity_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: EntityLevelModel.Entity_level
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
                    processResult: false,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp
};



module.exports = {
    initEntityLevel,
    fetchEntityLevelIdByDesignation
}