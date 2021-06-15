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
                    let imgFetch = await fsPack.simplifyFileFetch(el.img_path)
                    if (imgFetch.processRespCode === 200) {
                        picture = imgFetch.toClient.processResult
                    }
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







module.exports = {
    addImgOnInit,
    initAddMultipleImgs,
    fetchPictureInSystemById
}