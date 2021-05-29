const UserModel = require("../Models/User")
const sequelize = require("../Database/connection")
const tokenPack = require("../Middleware/tokenFunctions")
const passwordPack = require("../Middleware/randomPasswordFunctions")
const encryptPack = require("../Middleware/encrypt")
const uniqueIdPack = require("../Middleware/uniqueId")


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


/**
 * Initialize the table User by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initUser = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idDataStatus === null || dataObj.idUserLevel === null || dataObj.idEntity === null || dataObj.idTitle === null) {

        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, processResp)
    }
    //If success returns the hashed password
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
            return callback(false, processResp)
        } else {
            console.log(encryptResult);
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




/**
 * Fetches user data based on his username 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchUsedDataByUsername = (username, callback) => {
    sequelize
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
    fetchUsers,
    fetchUsedDataByUsername,
    initUser
}