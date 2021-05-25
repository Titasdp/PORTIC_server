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
 * initialize entity level table by introducing default values
 * Status:Completed
 * @param {Object} req request sended by the client
 * @param {callback} callback 
 */
const initEntityLevel = async (req, callback) => {
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
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created.",
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
 * fetches the id of a entityLevel based on his designation  
 * Status:Completed
 * @param {String} designation designation denominated to the entityLevel
 * @param {Callback} callback 
 */
const fetchEntityLevelIdByDesignation = (designation, callback) => {
    sequelize
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
    fetchAllEntityLevel,
    initEntityLevel,
    fetchEntityLevelIdByDesignation
}