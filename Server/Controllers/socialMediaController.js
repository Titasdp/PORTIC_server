const EntitySocialMediaModel = require("../Models/EntitySocialMedia")
const sequelize = require("../Database/connection")


/**
 * init social media types 
 * @param {Req} req The request sended by the client
 * @param {Callback} callback 
 */
const initSocialMediaType = async (dataObj, callback) => {

    if (dataObj.idEntity === null || dataObj.socialMediaTypes.length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, processResp)
    }
    let insertArray = [
        ['https://www.facebook.com/porticpporto', dataObj.socialMediaTypes[0].dataValues.id_type, dataObj.idEntity],
        ['https://www.instagram.com/politecnicodoporto/', dataObj.socialMediaTypes[1].dataValues.id_type, dataObj.idEntity],
        ['https://www.youtube.com/channel/UCa0njrkoyEd8kwjIVPE5pNg', dataObj.socialMediaTypes[2].dataValues.id_type, dataObj.idEntity],
        ['https://twitter.com/politecnico', dataObj.socialMediaTypes[3].dataValues.id_type, dataObj.idEntity],
        ['https://www.linkedin.com/company/portic-pporto', dataObj.socialMediaTypes[4].dataValues.id_type, dataObj.idEntity],
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