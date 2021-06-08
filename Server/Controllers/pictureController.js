const PictureModel = require("../Models/Picture");
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");




/**
 * Introduce predefine images path based in other init functions
 * @param {Object} dataObj Object that contains multiple elements in it
 * @param {Callback} callback 
 */
const addImgOnInit = async (dataObj, callback) => {

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
const initAddMultipleImgs = async (dataObj, callback) => {

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




module.exports = {
    addImgOnInit,
    initAddMultipleImgs,

}