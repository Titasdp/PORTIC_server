const EntitySocialMediaModel = require("../Models/EntitySocialMedia")
const sequelize = require("../Database/connection")
//Controllers 
const socialMediaTypeController = require("../Controllers/socialMediaTypeController")


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_social_media FROM Entity_social_media", {
            model: EntitySocialMediaModel.Entity_social_media
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
 * init social media types 
 * @param {Req} req The request sended by the client
 * @param {Callback} callback 
 */
const initSocialMediaType = async (dataObj) => {

    // let processResp = {}

    let facebookId = (await socialMediaTypeController.fetchSocialMediaTypeIdByDesignation("Facebook"))
    let instagramId = (await socialMediaTypeController.fetchSocialMediaTypeIdByDesignation("Instagram"))
    let linkedInId = (await socialMediaTypeController.fetchSocialMediaTypeIdByDesignation("LinkedIn"))
    let twitterId = (await socialMediaTypeController.fetchSocialMediaTypeIdByDesignation("Twitter"))
    let youtubeId = (await socialMediaTypeController.fetchSocialMediaTypeIdByDesignation("Youtube"))

    if (facebookId.processRespCode === 200 || instagramId.processRespCode === 200 || linkedInId.processRespCode === 200 || twitterId.processRespCode === 200 || youtubeId.processRespCode === 200) {
        facebookId = facebookId.toClient.processResult[0].id_type;
        instagramId = instagramId.toClient.processResult[0].id_type;
        linkedInId = linkedInId.toClient.processResult[0].id_type;
        twitterId = twitterId.toClient.processResult[0].id_type;
        youtubeId = youtubeId.toClient.processResult[0].id_type;

    } else {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: false,
                processError: null,
                processMsg: "Something went wrong",
            }
        }
        return processResp
    }


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

    if (dataObj.idEntity === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp;
    }
    let insertArray = [
        ['https://www.facebook.com/porticpporto', facebookId, dataObj.idEntity],
        ['https://www.instagram.com/politecnicodoporto/', instagramId, dataObj.idEntity],
        ['https://www.youtube.com/channel/UCa0njrkoyEd8kwjIVPE5pNg', youtubeId, dataObj.idEntity],
        ['https://twitter.com/politecnico', twitterId, dataObj.idEntity],
        ['https://www.linkedin.com/company/portic-pporto', linkedInId, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_social_media (url, id_social_media,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntitySocialMediaModel.Entity_social_media
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
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
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp;
};

/**
 * fetches all  entities Social medias 
 * @param {Req} req Sended by the client
 * @param {callback} callback 
 */
const fetchSocialEntitiesSocialMedias = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_social_media ", {
            model: EntitySocialMediaModel.Entity_social_media
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
            console.log(error)
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
 * Fetches all Social media for a specific social media 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchEntitySocialMedia = (dataObj, callback) => {
    let query = `SELECT Entity_social_media.url, Social_media_type.designation as social_media_type FROM (Entity_social_media inner Join 
        Social_media_type on Social_media_type.id_type = Entity_social_media.id_social_media)
       where Entity_social_media.id_entity =:id_entity;`
    sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntitySocialMediaModel.Entity_social_media
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
    initSocialMediaType,
    fetchSocialEntitiesSocialMedias,
    fetchEntitySocialMedia
}