const MediaModel = require("../Models/Media") //Main Model
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");





/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchMediaByIdEntity = async (dataObj, callback) => {
    let processResp = {}

    if (!dataObj.req.sanitize(dataObj.req.params.lng) || !dataObj.req.params.id) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
            }
        }
        return callback(false, processResp)

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? ` SELECT Media.id_media, Media.title_pt as title, Media.description_pt as description, Media.youtube_path FROM(  Media  inner Join 
        Data_Status on Data_Status.id_status= Media.id_status) WHERE Data_Status.designation = 'Published' AND Media.id_entity =:id_entity;` : `SELECT Media.id_media, Media.title_eng as title, Media.description_eng as description, Media.youtube_path FROM(  Media  inner Join 
            Data_Status on Data_Status.id_status= Media.id_status) WHERE Data_Status.designation = 'Published' AND Media.id_entity = :id_entity;`;

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: MediaModel.Media
        })
        .then(async data => {
            let courses = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {

                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return callback(true, processResp)
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
            return callback(false, processResp)
        });
};



/**
 * Initialize the table Media by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initMedia = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null || dataObj.idDataStatus == null) {

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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Media'), `Video 01`, `Vídeo 01`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `https://www.youtube.com/watch?v=t4-8lJ0ALNU&t=4s`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 02`, `Vídeo 02`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 03`, `Vídeo 03`, `Welcome to PORTIC`, `Bem-vindo to PORTIC`, `https://youtu.be/U0CxhBa4XWw`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 04`, `Vídeo 04`, `PORTIC's deed of grant video`, `PORTIC's deed of grant video`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
    ]
    sequelize
        .query(
            `INSERT INTO Media(id_media,title_eng,title_pt,description_eng,description_pt,youtube_path,id_publisher,id_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: MediaModel.Media
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
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
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });

}




/**
 * Fetches all Course 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchMedia = (req, callback) => {
    sequelize
        .query("select * from Media", {
            model: MediaModel.Media
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
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};















module.exports = {
    fetchMediaByIdEntity,
    initMedia,
    fetchMedia

}