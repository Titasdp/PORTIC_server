const UserModel = require("../Models/User")
const sequelize = require("../Database/connection")
const tokenPack = require("../Middleware/tokenFunctions")
const passwordPack = require("../Middleware/randomPasswordFunctions")
const encryptPack = require("../Middleware/encrypt")
const uniqueIdPack = require("../Middleware/uniqueId")


/**
 * gets User ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_user FROM User", {
            model: UserModel.User
        })
        .then(data => {
            respCode = 200;
            if (data[0].length === 0) {
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
 * The main objective of this function is to login an user
 * @param {Object} dataObj Contains multiple information 
 * @param {Callback} callback 
 */
const userLogin = (dataObj, callback) => {
    let processResp = {}

    encryptPack.decryptPassword({
        password: dataObj.req.Sanitize(req.body.password),
        hash: dataObj.userData.password,
    }, (isError, decryptResult) => {
        if (isError) {
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong, please try again later.",
                }
            }
            return callback(false, processResp)

        } else {
            if (decryptResult) {
                tokenPack.generateToken({
                        user: {
                            id_user: dataObj.userData.id_user,
                            user_code: "PORTIC_IPP_ASSOCIATION"
                        }
                    },
                    token => {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: {
                                    token: token,
                                    username: dataObj.userData.username
                                },
                                processError: null,
                                processMsg: "Successful Login !!",
                            }
                        }
                        return callback(true, processResp)
                    }
                );
            } else {
                processResp = {
                    processRespCode: 400,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "The username and password you entered did not match our records.",
                    }
                }
                return callback(false, processResp)
            }
        }
    })
}



const initUser = async (dataObj) => {
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

    if (dataObj.idDataStatus === null || dataObj.idUserLevel === null || dataObj.idEntity === null || dataObj.idTitle === null) {

        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp
    }
    return await new Promise((resolve, reject) => {
        encryptPack.encryptPassword("porticSuperAdmin", (encryptError, encryptResult) => {
            if (encryptError) {
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please try again later.",
                    }
                }
                resolve(processResp)
            } else {
                let insertArray = [
                    [uniqueIdPack.generateRandomId('_User'), `superAdmin`, encryptResult, "Tiago de Pina", "eu tiago", "Me Tiago", "tiagopina20014@gmail.com", "939908427", dataObj.idTitle, dataObj.idDataStatus, dataObj.idUserLevel, dataObj.idEntity],
                ]
                sequelize
                    .query(
                        `INSERT INTO User (id_user,username,password,full_name,description_pt,description_eng,email,phone_numb,id_title,id_status,id_user_level,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                            replacements: insertArray
                        }, {
                            model: UserModel.User
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
                resolve(processResp)
            }
        })
    })

}




/**
 * Fetches all users 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchUsers = (req, callback) => {
    sequelize
        .query("SELECT * FROM User", {
            model: UserModel.User
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





const fetchUsedDataByUsername = async (username) => {
    let processResp = {}
    await sequelize
        .query("SELECT * FROM User where username =:username", {
            replacements: {
                username: username
            }
        }, {
            model: UserModel.User
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



// Todo NEW 
/**
 * Fetches user data based on his username 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchIdUserByUsername = async (username) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_user FROM User where username =:username", {
            replacements: {
                username: username
            }
        }, {
            model: UserModel.User
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


























module.exports = {
    fetchUsers,
    fetchUsedDataByUsername,
    initUser,
    fetchIdUserByUsername
}