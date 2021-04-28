const EntityLevelModel = require("../Models/EntityLevel")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all entity levels from the Database
 * Done
 */
fetchAllEntityLevel = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_level", {
            model: EntityLevelModel.Entity_level
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
 * Function that adds predefined entity level elements to the table
 * Done
 */
initializeEntityLevel = async (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_EntityLevel'), 'Primary'],
        [uniqueIdPack.generateRandomId('_EntityLevel'), 'Secondary '], ,
    ]
    await sequelize
        .query(
            `INSERT INTO User_status (id_status,designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityLevelModel.Entity_level
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
 * Function that returns entity level id based on designation
 * Done
 */
fetchEntityLevelIdByDesignation = (designation, callback) => {
    sequelize
        .query("SELECT id_entity_level FROM Entity_level where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: EntityLevelModel.Entity_level
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
    fetchAllEntityLevel,
    initializeEntityLevel,
    fetchEntityLevelIdByDesignation
}