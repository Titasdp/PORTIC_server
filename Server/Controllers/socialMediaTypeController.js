const SocialMediaTypeModel = require("../Models/SocialMediaType")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * init social media types 
 * @param {Req} req The request sended by the client
 * @param {Callback} callback 
 */
const initSocialMediaType = async (req, callback) => {
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
 * fetches all Social media type
 * @param {Req} req Sended by the client
 * @param {callback} callback 
 */
const fetchSocialMediaTypes = (req, callback) => {
    sequelize
        .query("SELECT * FROM Social_media_type ", {
            model: SocialMediaTypeModel.Social_media_type
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            let processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data,
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
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};



module.exports = {
    initSocialMediaType,
    fetchSocialMediaTypes
}