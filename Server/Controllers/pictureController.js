const PictureModel = require("../Models/Picture");
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")


/**
 * Introduce predefine images path based in other init functions
 * @param {Object} dataObj Object that contains multiple elements in it
 * @param {Callback} callback 
 */
const addImgOnInit = async (dataObj) => {

    let generatedId = uniqueIdPack.generateRandomId('_Picture')


    let insertArray = [
        [generatedId, dataObj.imgPath, 0],
    ]
    sequelize
        .query(
            `INSERT INTO Picture (id_picture,img_path,gallery_picture) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: PictureModel.Picture
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: {
                        data: data,
                        generatedId: generatedId
                    },
                    processError: null,
                    processMsg: "Data created successfully.",
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
 * Introduce predefine images path based in other init functions
 * @param {Object} dataObj Object that contains multiple elements in it
 * @param {Callback} callback 
 */
const initAddMultipleImgs = async (dataObj) => {

    let generatedIds = [];
    let insertArray = [];

    for (const data of dataObj.insertArray) {
        let randomId = uniqueIdPack.generateRandomId('_Picture')
        let dataArray = [randomId, data, 0];
        insertArray.push(dataArray)
        generatedIds.push(randomId)
    }

    await sequelize
        .query(
            `INSERT INTO Picture (id_picture,img_path,gallery_picture) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: PictureModel.Picture
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: {
                        data: data,
                        generatedIds: generatedIds
                    },
                    processError: null,
                    processMsg: "Data created successfully.",
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


const fetchPictureInSystemById = async (id_picture) => {
    let processResp = {}
    if (id_picture === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: `No id received.`,
            }
        }
        return processResp
    }
    let query = `Select Picture.img_path from Picture where Picture.id_picture =:id_picture;`
    await sequelize
        .query(query, {
            replacements: {
                id_picture: id_picture
            }
        }, {
            model: PictureModel.Picture
        })
        .then(async data => {
            let picture = null
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    // let imgFetch = await fsPack.simplifyFileFetch(el.img_path)
                    // if (imgFetch.processRespCode === 200) {

                    // }
                    picture = el.img_path
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: picture,
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
                    processResult: picture,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp

}



const updatePictureInSystemById = async (dataObj) => {
    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return processResp
    }

    if (dataObj.req.files.file === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return processResp
    }
    console.log(dataObj.id_picture);
    if (dataObj.id_picture === null) {
        let updateResult = await directUpdatePicture(dataObj)
        return updateResult
    } else {

        let fetchResult = await fetchPicturePathById(dataObj.id_picture)

        if (fetchResult.processRespCode === 500 || !fetchResult.toClient.processResult) {
            return {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong.",
                }
            }
        }

        let oldPath = fetchResult.toClient.processResult
        let idPicture = dataObj.id_picture

        let updateResult = await indirectUpdatePicture({
            oldPath: oldPath,
            folder: dataObj.folder,
            req: dataObj.req
        })

        if (updateResult.processRespCode !== 200) {
            return updateResult
        } else {
            let query = `UPDATE Picture SET Picture.img_path=:img_path Where Picture.id_picture=:id_picture`
            await sequelize
                .query(query, {
                    replacements: {
                        img_path: updateResult.toClient.processResult,
                        id_picture: idPicture
                    }
                }, {
                    model: PictureModel.Picture
                })
                .then(async data => {

                    processResp = {
                        processRespCode: 200,
                        toClient: {
                            processResult: data[0],
                            processError: null,
                            processMsg: "Picture updated Successfully",
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    processResp = {
                        processRespCode: 500,
                        toClient: {
                            processResult: picture,
                            processError: error,
                            processMsg: "Something when wrong please try again later",
                        }
                    }

                });

            return processResp
        }

        // !!!!!!!!!!!!!!!!!!!!!


    }
}
/**
 * 
 * @returns Updates Picture if the id = null (updates when there is no img associated)
 */
const directUpdatePicture = async (dataObj) => {

    // console.log(dataObj.req.files.file.mimetype);
    // /Server/Images

    if (!await fsPack.confirmIsImg(dataObj.req.sanitize(dataObj.req.files.file.mimetype))) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The file attached must be an image.",
            }
        }
        return processResp
    }


    let imgUploadResult = await fsPack.simpleFileUpload(dataObj)

    if (imgUploadResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    } else {
        let generatedId = uniqueIdPack.generateRandomId('_Picture')
        let insertArray = [
            [generatedId, imgUploadResult.toClient.processResult, 0]
        ];

        await sequelize
            .query(
                `INSERT INTO Picture (id_picture,img_path,gallery_picture) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                    replacements: insertArray
                }, {
                    model: PictureModel.Picture
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 201,
                    toClient: {
                        processResult: {
                            data: data,
                            generatedId: generatedId
                        },
                        processError: null,
                        processMsg: "Data created successfully.",
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
}


const indirectUpdatePicture = async (dataObj) => {
    let exist = await (fsPack.confirmIsImg(dataObj.req.sanitize(dataObj.req.files.file.mimetype)))
    if (!exist) {

        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The file attached must be an image.",
            }
        }
        return processResp
    }
    let deleteResult = await fsPack.simpleFileDelete({
        deletePath: dataObj.oldPath
    })

    if (deleteResult.processRespCode === 500) {
        return deleteResult
    }


    let imgUploadResult = await fsPack.simpleFileUpload(dataObj)
    return imgUploadResult
}






//*Complement
/**
 * Fetches Picture Path by id_picture
 * Status: Complete
 */
const fetchPicturePathById = async (id_picture) => {
    let processResp = {}
    await sequelize
        .query("SELECT img_path FROM Picture where Picture.id_picture =:id_picture", {
            replacements: {
                id_picture: id_picture
            }
        }, {
            model: PictureModel.Picture
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
                    processResult: ((!data[0][0].img_path) ? null : data[0][0].img_path),
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



const addPictureOnCreate = async (dataObj) => {
    console.log(dataObj.req.files.file);
    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        console.log("failed inside files");
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return processResp
    }

    if (dataObj.req.files.file === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return processResp
    }

    let updateResult = await directUpdatePicture(dataObj)
    return updateResult



    // !!!!!!!!!!!!!!!!!!!!!



}



const deletePictureInSystemById = async (dataObj) => {
    let fetchResult = await fetchPicturePathById(dataObj.id_picture)

    if (fetchResult.processRespCode === 500 || !fetchResult.toClient.processResult) {
        return {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong.",
            }
        }
    }

    let oldPath = fetchResult.toClient.processResult
    let idPicture = dataObj.id_picture

    let deleteResult = await deleteFile({
        oldPath: oldPath,
        folder: dataObj.folder,
        req: dataObj.req
    })

    if (deleteResult.processRespCode !== 200) {
        return updateResult
    } else {
        let query = `DELETE FROM Picture where id_picture =:id_picture`
        await sequelize
            .query(query, {
                replacements: {
                    id_picture: idPicture
                }
            }, {
                model: PictureModel.Picture
            })
            .then(async data => {

                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "Picture updated Successfully",
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
                        processMsg: "Something when wrong please try again later",
                    }
                }

            });

        return processResp
    }
}
const deleteFile = async (dataObj) => {
    let deleteResult = await fsPack.simpleFileDelete({
        deletePath: dataObj.oldPath
    })
    return deleteResult
}















module.exports = {
    addImgOnInit,
    initAddMultipleImgs,
    fetchPictureInSystemById,
    //New
    updatePictureInSystemById,
    addPictureOnCreate,
    deletePictureInSystemById
}