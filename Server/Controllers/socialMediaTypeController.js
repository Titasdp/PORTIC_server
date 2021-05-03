const SocialMediaTypeModel = require("../Models/SocialMediaType")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all entity levels from the Database
 * Done
 */
fetchAllSocialMediaType = (req, callback) => {
    sequelize
        .query("SELECT * FROM Social_media_type", {
            model: SocialMediaTypeModel.Social_media_type
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
initSocialMediaType = async (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_SocialMediaType'), 'Facebook'],
        [uniqueIdPack.generateRandomId('_SocialMediaType'), 'Instagram'],
        [uniqueIdPack.generateRandomId('_SocialMediaType'), 'Youtube'],
        [uniqueIdPack.generateRandomId('_SocialMediaType'), 'Twitter'],
        [uniqueIdPack.generateRandomId('_SocialMediaType'), 'LinkedIn'],
    ]
    await sequelize
        .query(
            `INSERT INTO Social_media_type (id_type, designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: SocialMediaTypeModel.Social_media_type
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
 * Function that returns entity level id based on designation
 * Done
 */
fetchSocialMediaTypeIdByEntity = (designation, callback) => {
    sequelize
        .query("SELECT id_type FROM Social_media_type where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: SocialMediaTypeModel.Social_media_type
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
    fetchAllSocialMediaType,
    initSocialMediaType,
    fetchSocialMediaTypeIdByEntity
}