const {
    rejects
} = require('assert');
const fs = require('fs')

const uniqueIdPack = require("./uniqueId")

//Upload File
fileUpload = async (dataObj, callback) => {

    let img;
    let uploadPath;
    let processResp = {}

    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (dataObj.req.files.img === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (!confirmIsImg(dataObj.req.files.img.mimetype)) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Your file must be an image.",
            }
        }
        return callback(false, processResp)

    }

    checkFileExistence(process.cwd() + '/Server/images/' + dataObj.req.files.img.name, (exist) => {
        if (exist) {
            processResp = {
                processRespCode: 409,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "There is already an image with that name, please change the image name.",
                }
            }
            return callback(false, processResp)
        }



        img = dataObj.req.files.img
        uploadPath = process.cwd() + '/Server/images/' + img.name;


        img.mv(uploadPath, function (err) {
            let functionSuccess = false
            if (err) {
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please ty again later.",
                    }
                }
            } else {
                functionSuccess = true
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: uploadPath,
                        processError: null,
                        processMsg: "Image uploaded successfully.",
                    }
                }
            }

            return callback(functionSuccess, processResp)
        })
    })
}
//Delete file
const fileDelete = (dataObj, callback) => {

    let processResp = {}

    if (!dataObj.req.files || Object.keys(dataObj.req.files).length === 0) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (dataObj.req.files.img === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There must be a file attach to the request.",
            }
        }
        return callback(false, processResp)
    }
    if (!confirmIsImg(dataObj.req.files.img.mimetype)) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Your file must be an image.",
            }
        }
        return callback(false, processResp)

    }

    fs.unlink(dataObj.req.sanitize(dataObj.req.body.oldImgPath), function (err) {

        let callbackSuccess = false

        if (err) {
            console.log(err);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please ty again later.",
                }
            }
        } else {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "The file was successfully deleted.",
                }
            }
            callbackSuccess = true
        }
        return callback(callbackSuccess, processResp)
    });
}
/**
 * Fetched a file based on a path received in the object (dataObj)
 * @param {Object} dataObj Object that contains multiple data used tod complete this function 
 * @param {callback} callback 
 */
const fileFetch = (dataObj, callback) => {
    let processResp = {}

    console.log(dataObj.path);
    checkFileExistence(dataObj.path, (exist, result) => {

        if (!exist) {
            processResp = {
                processRespCode: 409,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "File fetch failed, there is no file  with that name",
                }
            }
            return callback(false, processResp)
        } else {
            fs.readFile(dataObj.path, function (err, data) {
                let functionSuccess = false
                if (err) {
                    console.log(err);
                    processResp = {
                        processRespCode: 500,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "Something went wrong please ty again later.",
                        }
                    }
                } else {
                    functionSuccess = true
                    processResp = {
                        processRespCode: 200,
                        toClient: {
                            processResult: data,
                            processError: null,
                            processMsg: "The file was successfully fetched.",
                        }
                    }
                }
                return callback(functionSuccess, processResp)
            });

        }
    })
}



//Todo
const simplifyFileFetch = async (path) => {
    let processResp = {}



    if (path === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Missing file.",
            }
        }
        return processResp
    }

    let exist = await simplifyCheckFileExistence(path)

    if (!exist) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Missing file.",
            }
        }
        return processResp
    }
    return await new Promise((resolve, reject) => {

        fs.readFile(path, function (err, data) {
            let functionSuccess = false
            if (err) {
                console.log(err);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please ty again later.",
                    }
                }
            } else {
                functionSuccess = true
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data,
                        processError: null,
                        processMsg: "The file was successfully fetched.",
                    }
                }
            }
            resolve(processResp);
        });
    })
}



/**
 * Confirms if there is a file in a expecific path 
 * @param {String} imgPath The path where file is stored in the Server
 * @returns true (if confirms file existent) or false (if denny existent)
 */
const checkFileExistence = async (imgPath, callback) => {
    await fs.access(imgPath, (err, data) => {
        console.log(err);
        if (err) {
            return callback(false, err) //
        }
        return callback(true, data)
    })
}




/**
 * confirms if the file sended by the client is from the image.
 * @param {String} fileMimeType Contains the file type
 * @returns True or false
 */
const confirmIsImg = async (fileMimeType) => {
    console.log(fileMimeType);
    if (fileMimeType.includes('image/')) {
        return true
    } else {
        return false
    }
}




/**
 * confirms if the file sended by the client is from the image.
 * @param {String} fileMimeType Contains the file type
 * @returns True or false
 */
const confirmIsPdf = async (fileMimeType) => {
    console.log();
    console.log(fileMimeType);
    if (await fileMimeType.includes('application/pdf')) {
        return true
    } else {
        return false
    }
}

/**
 * Confirms if there is a file in a expecific path 
 * @param {String} imgPath The path where file is stored in the Server
 * @returns true (if confirms file existent) or false (if denny existent)
 */
const simplifyCheckFileExistence = async (imgPath) => {
    return await new Promise((resolve, reject) => {
        fs.access(imgPath, (err) => {
            if (!err) {
                resolve(true) //
            } else {
                resolve(false)
            }
        })
    })
}




/** 
 * Simple file Upload
 * */
const simpleFileUpload = async (dataObj) => {
    console.log(dataObj.req.files.file);
    console.log(dataObj.folder);
    let processResp = {}
    let generatedPath = dataObj.folder + uniqueIdPack.generateRandomId('_') + dataObj.req.sanitize(dataObj.req.files.file.name)
    let uploadPath = `${process.cwd()}/Server` + generatedPath
    return await new Promise(async (resolve) => {
        await dataObj.req.files.file.mv(uploadPath, function (err) {
            console.log("here 6");
            if (err) {
                console.log(err);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please ty again later.",
                    }
                }
                resolve(processResp)
            } else {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: generatedPath,
                        processError: null,
                        processMsg: "Image uploaded successfully.",
                    }
                }
                resolve(processResp)
            }
        })
    })

}





/** 
 * Simple file Upload
 * */
const simpleFileDelete = async (dataObj) => {
    console.log("here 4");
    console.log(dataObj);

    let pathToDelete = `${process.cwd()}/Server` + dataObj.deletePath

    console.log(pathToDelete);
    let processResp = {}
    let fileExist = await simplifyCheckFileExistence(pathToDelete)
    if (!fileExist) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went terribly Wrong.",
            }
        }
        return processResp
    } else {
        return await new Promise(async (resolve) => {
            fs.unlink(pathToDelete, function (err) {
                if (err) {
                    processResp = {
                        processRespCode: 500,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "Something went wrong please ty again later.",
                        }
                    }
                    resolve(processResp)
                } else {
                    processResp = {
                        processRespCode: 200,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "The file was successfully deleted.",
                        }
                    }
                    resolve(processResp)
                }
            })
        })

    }



}



// C:\Users\tiago\Documents\PersonalProjects\BackEnd\moitasCarsServer\moitasCarsServer\Server\images\adlisa.jpg

module.exports = {
    // fileUpload,
    // fileDelete,
    // fileFetch,
    simplifyFileFetch,
    simpleFileDelete,
    simpleFileUpload,

    // Confirmations
    simplifyCheckFileExistence,
    confirmIsImg,
    confirmIsPdf
}