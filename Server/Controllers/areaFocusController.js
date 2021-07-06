//Models
const EntityAreasFocusModel = require("../Models/EntityAreasFocus")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")
const fsPack = require("../Middleware/fsFunctions")

//Aux Controller 
const pictureController = require("../Controllers/pictureController")

// Env
require("dotenv").config();


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_areas_focus FROM Entity_Areas_focus", {
            model: EntityAreasFocusModel.Entity_areas_focus
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
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchAreaFocusByIdEntity = async (dataObj) => {
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_pt as description, Picture.img_path from  (Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon) WHERE Entity_Areas_focus.id_entity =:id_entity;` : `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_eng as description, Picture.img_path from  (Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon) WHERE Entity_Areas_focus.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityAreasFocusModel.Entity_areas_focus
        })
        .then(async data => {
            let areasFocus = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    // let imgFetch = await fsPack.simplifyFileFetch(el.img_path)
                    console.log(el.img_path);
                    let areaFocusObj = {
                        id_areas_focus: el.id_areas_focus,
                        description: el.description,
                        img: process.env.API_URL + el.img_path
                    }
                    areasFocus.push(areaFocusObj)
                }
            }
            console.log(areasFocus.length);
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: areasFocus,
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
 * Initialize the table CorseFocus by introducing predefined data to it.
 * Status:Completed
 */
const initAreaFocus = async (dataObj) => {
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
    if (dataObj.idCreator === null || dataObj.idEntity === null) {

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
    let imgsInitResult = await pictureController.initAddMultipleImgs({
        insertArray: [`/Images/Icons/search.png`, `/Images/Icons/tech.png`, `/Images/Icons/creativity.png`, `/Images/Icons/business.png`, `/Images/Icons/incubation.png`, `/Images/Icons/startups.png`]
    })

    if (imgsInitResult.processRespCode === 500) {
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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Procura e desenvolvimento`, `Search and development`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[0]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Tecnologia e partilha de conhecimentos`, `Technology and knowledge sharing`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[1]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Inovação e criatividade`, `Innovation and creativity`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[2]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Empreendedorismo`, `Entrepreneurship`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[3]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Incubação tecnológica`, `Technology incubation`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[4]],
        [uniqueIdPack.generateRandomId('_AreaFocus'), `Startups e spin-offs`, `Startups and spin-offs`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[5]],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_Areas_focus(id_areas_focus,description_pt,description_eng,id_entity,id_icon) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityAreasFocusModel.Entity_areas_focus
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
 * Fetches all HiringTips 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchAreaFocus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Entity_Areas_focus", {
            model: EntityAreasFocusModel.Entity_areas_focus
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


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/**
 *Add new area focus  
 *Status:Completed
 */
const addAreaFocus = async (dataObj) => {

    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng)) {
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


    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/Icons/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_AreaFocus'), dataObj.req.sanitize(dataObj.req.body.description_pt), dataObj.req.sanitize(dataObj.req.body.description_eng), dataObj.idEntity, pictureUploadResult.toClient.processResult.generatedId],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity_Areas_focus(id_areas_focus,description_pt,description_eng,id_entity,id_icon) VALUES  ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityAreasFocusModel.Entity_areas_focus
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
 *Fetch all area focus based on some admin data  
 *Status:Completed
 */
const fetchAreaFocusByAdmin = async (dataObj) => {
    let processResp = {}

    let query = (dataObj.user_level === `Super Admin`) ? `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_eng ,Entity_Areas_focus.description_pt,Entity_Areas_focus.created_at, Picture.img_path as img, Entity.initials  from  
    ((Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon)
     INNER JOIN Entity on Entity.id_entity = Entity_Areas_focus.id_entity)` : `Select Entity_Areas_focus.id_areas_focus, Entity_Areas_focus.description_eng ,Entity_Areas_focus.description_pt,Entity_Areas_focus.created_at, Picture.img_path as img, Entity.initials from  
    ((Entity_Areas_focus INNER JOIN Picture ON Picture.id_picture = Entity_Areas_focus.id_icon) INNER JOIN Entity on Entity.id_entity = Entity_Areas_focus.id_entity) WHERE Entity.id_entity = :id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: EntityAreasFocusModel.Entity_areas_focus
        })
        .then(async data => {
            let areasFocus = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let areaFocusObj = {
                        id_areas_focus: el.id_areas_focus,
                        description_eng: el.description_eng,
                        description_pt: el.description_pt,
                        created_at: el.created_at,
                        img: process.env.API_URL + el.img,
                        entity_initials: el.initials,
                    }
                    areasFocus.push(areaFocusObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: areasFocus,
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
const editAreaFocus = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.description_pt)) {
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
            `UPDATE Entity_Areas_focus SET description_eng=:description_eng,description_pt=:description_pt Where Entity_Areas_focus.id_areas_focus=:id_areas_focus`, {
                replacements: {
                    id_areas_focus: dataObj.req.sanitize(dataObj.req.params.id),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                }
            }, {
                model: EntityAreasFocusModel.Entity_areas_focus
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
 * patch picture 
 * Status:Completed
 */
const updateAreaFocusPicture = async (dataObj) => {
    let fetchResult = await fetchAreaFocusImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await pictureController.updatePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/Icons/`
    })


    if (uploadResult.processRespCode !== 201) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE Entity_Areas_focus SET Entity_Areas_focus.id_icon =:id_icon  Where Entity_Areas_focus.id_areas_focus=:id_areas_focus `, {
                    replacements: {
                        id_icon: uploadResult.toClient.processResult.generatedId,
                        id_areas_focus: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: EntityAreasFocusModel.Entity_areas_focus
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
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


}


/**
 * Delete 
 * Status:Completed
 */
const deleteAreaFocus = async (dataObj) => {
    let fetchResult = await fetchAreaFocusImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let deleteResult = await pictureController.deletePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/Icons/`
    })


    if (deleteResult.processRespCode !== 200) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `DELETE FROM Entity_Areas_focus Where Entity_Areas_focus.id_areas_focus=:id_areas_focus `, {
                    replacements: {
                        id_areas_focus: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: EntityAreasFocusModel.Entity_areas_focus
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
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


}


//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchAreaFocusImgId = async (id_areas_focus) => {
    let processResp = {}
    await sequelize
        .query(`select id_icon From Entity_Areas_focus where Entity_Areas_focus.id_areas_focus =:id_areas_focus;`, {
            replacements: {
                id_areas_focus: id_areas_focus
            }
        }, {
            model: EntityAreasFocusModel.Entity_areas_focus
        })
        .then(data => {
            console.log(data);
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            // console.log(data[0].id_picture);
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: ((!data[0][0].id_icon) ? null : data[0][0].id_icon),
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
    initAreaFocus,
    fetchAreaFocus,
    fetchAreaFocusByIdEntity,

    // Admin 
    fetchAreaFocusByAdmin,
    editAreaFocus,
    addAreaFocus,
    updateAreaFocusPicture,
    deleteAreaFocus

}