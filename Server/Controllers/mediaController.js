// Main model 
const MediaModel = require("../Models/Media") //Main Model
//Database Connection 
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
//Controller 
const dataStatusController = require("../Controllers/dataStatusController")




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
        [uniqueIdPack.generateRandomId('_Media'), `Video 01`, `Vídeo 01`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `Portuguese Minister of Labour, Solidarity and Social Security, Ana Godinho, visits PORTIC`, `https://www.youtube.com/watch?v=t4-8lJ0ALNU&t=4s`, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 02`, `Vídeo 02`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `Portuguese Minister of Science, Technology and Higher Education, Manuel Heitor, visits PORTIC`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 03`, `Vídeo 03`, `Welcome to PORTIC`, `Bem-vindo to PORTIC`, `https://youtu.be/U0CxhBa4XWw`, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Media'), `Video 04`, `Vídeo 04`, `PORTIC's deed of grant video`, `PORTIC's deed of grant video`, `https://youtu.be/io-5NSsoXqQ`, dataObj.idEntity, dataObj.idDataStatus],
    ]
    await sequelize
        .query(
            `INSERT INTO Media(id_media,title_eng,title_pt,description_eng,description_pt,youtube_path,id_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
            processResp = {
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
 * Fetches all Medias 
 * Status: Completed 
 */
const fetchAllMedia = async (dataObj) => {
    let processResp = {}
    let query = (dataObj.user_level === `Super Admin`) ? `Select Media.id_media, Media.title_eng, Media.title_pt, Media.description_eng , Media.description_pt  , Media.appearance_case, Media.youtube_path  ,Media.created_at , Data_Status.designation  ,Entity.initials
    From ((Media Inner Join Data_Status on Data_Status.id_status = Media.id_status ) Inner join Entity on Entity.id_entity = Media.id_entity) ` : `Select Media.id_media, Media.title_eng, Media.title_pt, Media.description_eng , Media.description_pt  , Media.appearance_case, Media.youtube_path  ,Media.created_at , Data_Status.designation  ,Entity.initials
    From ((Media Inner Join Data_Status on Data_Status.id_status = Media.id_status ) Inner join Entity on Entity.id_entity = Media.id_entity)  Where Entity.id_entity =: id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: MediaModel.Media
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data,
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




/**
 * edit user profile fields present in  
 * Status: Complete
 */
const editMedia = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.title_eng) || !dataObj.req.sanitize(dataObj.req.body.title_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.appearance_case) || !dataObj.req.sanitize(dataObj.req.body.youtube_path)) {
        processResult = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Client request is incomplete !!"
            }
        }
        return processResult
    }


    await sequelize
        .query(
            `UPDATE Media SET title_eng=:title_eng,title_pt=:title_pt, description_eng =:description_eng, description_pt =:description_pt, appearance_case=:appearance_case,youtube_path=:youtube_path  Where Media.id_media=:id_media`, {
                replacements: {
                    id_media: dataObj.req.sanitize(dataObj.req.params.id),
                    title_eng: dataObj.req.sanitize(dataObj.req.body.title_eng),
                    title_pt: dataObj.req.sanitize(dataObj.req.body.title_pt),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                    appearance_case: (isNaN(dataObj.req.body.appearance_case)) ? 3 : dataObj.req.sanitize(dataObj.req.body.appearance_case),
                    youtube_path: dataObj.req.sanitize(dataObj.req.body.youtube_path),
                }
            }, {
                model: MediaModel.Media
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The media was updated successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}



/**
 * Patch  Media status 
 * StatusCompleted
 */
const updateMediaStatus = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.new_status)) {
        processResult = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Client request is incomplete !!"
            }
        }
        return processResult
    }


    let fetchResult = await dataStatusController.fetchDataStatusIdByDesignation(dataObj.req.sanitize(dataObj.req.body.new_status))
    if (fetchResult.processRespCode !== 200) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something when wrong please try again later",
            }
        }
        return processResult
    }

    await sequelize
        .query(
            `UPDATE Media SET Media.id_status =:id_status  Where Media.id_media=:id_media `, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_media: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: MediaModel.Media
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data[0],
                    // {
                    //     // pt_answer: "Perfil actualizado com sucesso!",
                    //     // en_answer: "Profile updated Successfully"
                    // },
                    processError: null,
                    processMsg: "The brand was updated successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}




/**
 * Delete Media  
 * StatusCompleted
 */
const deleteMedia = async (dataObj) => {
    let processResp = {}
    await sequelize
        .query(
            `DELETE FROM Media Where Media.id_media=:id_media `, {
                replacements: {
                    id_media: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: MediaModel.Media
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data Deleted Successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}



/**
 * Add Media  
 * StatusCompleted
 */
const addMedia = async (dataObj) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null || !dataObj.req.sanitize(dataObj.req.body.title_eng) || !dataObj.req.sanitize(dataObj.req.body.title_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.appearance_case) || !dataObj.req.sanitize(dataObj.req.body.youtube_path)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }

    let dataStatusFetchResult = await (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
    if (dataStatusFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }
    // dataStatusFetchResult.toClient.processResult[0].id_status,
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Media'), dataObj.req.sanitize(dataObj.req.body.title_eng), dataObj.req.sanitize(dataObj.req.body.title_pt), dataObj.req.sanitize(dataObj.req.body.description_eng), dataObj.req.sanitize(dataObj.req.body.description_pt), dataObj.req.sanitize(dataObj.req.body.appearance_case), dataObj.req.sanitize(dataObj.req.body.youtube_path), dataObj.idEntity, dataStatusFetchResult.toClient.processResult[0].id_status, ],
    ]
    await sequelize
        .query(
            `INSERT INTO Media(id_media,title_eng,title_pt,description_eng,description_pt,appearance_case,youtube_path,id_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
            processResp = {
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


















module.exports = {
    fetchMediaByIdEntity,
    initMedia,

    //
    fetchAllMedia,
    editMedia,
    deleteMedia,
    updateMediaStatus,
    addMedia

}