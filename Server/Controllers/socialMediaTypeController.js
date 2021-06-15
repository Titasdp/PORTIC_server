const SocialMediaTypeModel = require("../Models/SocialMediaType")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")


/**
 * gets User Status ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_type FROM Social_media_type", {
            model: SocialMediaTypeModel.Social_media_type
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





const initSocialMediaType = async () => {
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
                    processMsg: "Something went wrong please try again later.",
                }
            }
        });
    return processResp
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


const fetchSocialMediaTypeIdByDesignation = async (designation) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_type FROM Social_media_type where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: SocialMediaTypeModel.Social_media_type
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
    initSocialMediaType,
    fetchSocialMediaTypes,
    fetchSocialMediaTypeIdByDesignation
}