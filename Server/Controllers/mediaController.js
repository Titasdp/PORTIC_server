const MediaModel = require("../Models/Media") //Main Model
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");




const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_media FROM Media", {
            model: MediaModel.Media
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




const fetchMediaByIdEntity = async (dataObj) => {
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
        return processResp

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? ` SELECT Media.id_media, Media.title_pt as title, Media.description_pt as description, Media.youtube_path FROM(  Media  inner Join 
        Data_Status on Data_Status.id_status= Media.id_status) WHERE Data_Status.designation = 'Published' AND Media.id_entity =:id_entity AND Media.appearance_case in (3,1);` : `SELECT Media.id_media, Media.title_eng as title, Media.description_eng as description, Media.youtube_path FROM(  Media  inner Join 
            Data_Status on Data_Status.id_status= Media.id_status) WHERE Data_Status.designation = 'Published' AND Media.id_entity = :id_entity AND  Media.appearance_case in (3,2);`;
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: MediaModel.Media
        })
        .then(async data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
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



const initMedia = async (dataObj) => {
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
    if (dataObj.idUser === null || dataObj.idEntity === null || dataObj.idDataStatus == null) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp
    }
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Media'), `Video 01`, `Vídeo 01`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `https://www.youtube.com/watch?v=t4-8lJ0ALNU&t=4s`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 02`, `Vídeo 02`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 03`, `Vídeo 03`, `Welcome to PORTIC`, `Bem-vindo to PORTIC`, `https://youtu.be/U0CxhBa4XWw`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 04`, `Vídeo 04`, `PORTIC's deed of grant video`, `PORTIC's deed of grant video`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
    ]
    await sequelize
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

        });
    return processResp
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