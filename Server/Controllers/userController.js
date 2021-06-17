//Main modes
const UserModel = require("../Models/User")
//Database Connection
const sequelize = require("../Database/connection")
// Middleware
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


const confirmUserExistentByParams = async (dataObj) => {
    let processResp = {}
    let arrayOfColumn = ['username', 'phone_numb', 'email']
    let responses = ['The username has already been taken.', 'The phone  number is already associated with another account.', 'The email is already associated with another account.']

    for (let i = 0; i < 3; i++) {
        let confirmExistenceResponse = await confirmParamsValueTaken({
            selectedField: arrayOfColumn[i],
            substitute: dataObj.paramsValueArray[i],
        })

        if (confirmExistenceResponse.processRespCode === 500) {
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

        if (confirmExistenceResponse.processRespCode === 200) {
            processResp = {
                processRespCode: 409,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: responses[i],
                }
            }
            return processResp
        }
    }
    return processResp = {
        processRespCode: 204,
        toClient: {
            processResult: null,
            processError: null,
            processMsg: "Fetch process completed successfully, but there is no content."
        }
    }

}

const confirmParamsValueTaken = async () => {
    let processResp = {}

    let query = `SELECT id_user FROM User where ${dataObj.selectedField} =:substitute`
    await sequelize
        .query(query, {
            replacements: {
                substitute: dataObj.substitute
            }

        }, {
            model: UserModel.User
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Data fetched successfully."
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
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
        });
    return processResp







}



/**
 * Realizes Login that makes the login process
 * @param {Obj} dataObj Object whit multiple data
 * @returns 
 */
const proceedUserLogin = async (dataObj) => {
    let processResp = {}
    let fetchResult = await loginFetchUserData(dataObj.req.sanitize(dataObj.req.body.username))

    if (fetchResult.processRespCode === 500) {
        return fetchResult.processRespCode
    } else if (fetchResult.processRespCode === 204) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The username and password you entered did not match our records.",
            }
        }
        return processResp
    }

    let id_user = fetchResult.toClient.processResult[0].id_user;
    let hash = fetchResult.toClient.processResult[0].password;
    let username = fetchResult.toClient.processResult[0].username;
    let user_level = fetchResult.toClient.processResult[0].user_level;
    let user_status = fetchResult.toClient.processResult[0].user_status;

    let decryptResult = await encryptPack.decryptPassword({
        password: dataObj.req.sanitize(dataObj.req.body.password),
        hash: hash
    })

    if (decryptResult.isError) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, please try again later.",
            }
        }
        return processResp
    } else {
        if (decryptResult.compareSame) {

            if (user_status !== "Normal") {
                let respMsg = "The account has been neutralize."
                if (user_status === "Blocked" || user_status === "Pendent Creation") {
                    respMsg = "The account is temporarily unavailable !!"
                }
                processResp = {
                    processRespCode: 401,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: respMsg,
                    }
                }

                return processResp
            }
            return await new Promise((resolve) => {
                tokenPack.generateToken({
                        user_data: {
                            id_user: id_user,
                            user_level: user_level,
                            user_code: "PORTIC_IPP_ASSOCIATION"
                        }
                    },
                    token => {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: {
                                    token: token,
                                    username: username,
                                    user_level: user_level
                                },
                                processError: null,
                                processMsg: "Successful Login !!",
                            }
                        }
                        resolve(processResp)
                    }
                );
            })
        } else {
            processResp = {
                processRespCode: 400,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "The username and password you entered did not match our records.",
                }
            }
            return processResp
        }
    }
}


/**
 * Realizes Login that makes the login process
 * @param {Obj} dataObj Object whit multiple data
 * @returns 
 */
const proceedUserRegister = async (dataObj) => {
    let processResp = {}


    if (dataObj.req.sanitize(dataObj.req.body.username) == null || dataObj.req.sanitize(dataObj.req.body.password) == null || dataObj.req.sanitize(dataObj.req.body.first_name) == null || dataObj.req.sanitize(dataObj.req.body.last_name) == null || dataObj.req.sanitize(dataObj.req.body.email) == null || dataObj.req.sanitize(dataObj.req.body.phone_numb) == null) {

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



    if (dataObj.idDataStatus === null || dataObj.idUserLevel === null || dataObj.idEntity === null || dataObj.idTitle === null) {
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


    let confirmUserExistentByParamsResult = await confirmUserExistentByParams()
    if (confirmUserExistentByParamsResult.processRespCode !== 204) {
        processResp = {
            processRespCode: confirmUserExistentByParamsResult.processRespCode,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: confirmUserExistentByParamsResult.toClient.processMsg,
            }
        }
        return processResp
    }



    return await new Promise((resolve) => {
        encryptPack.encryptPassword(dataObj.req.sanitize(dataObj.req.body.password), (encryptError, encryptResult) => {
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
                    [uniqueIdPack.generateRandomId('_User'), dataObj.req.sanitize(dataObj.req.body.username), encryptResult, `${ dataObj.req.sanitize(dataObj.req.body.first_name)} ${dataObj.req.sanitize(dataObj.req.body.last_name)}`, "", "", dataObj.req.sanitize(dataObj.req.body.email), dataObj.req.sanitize(dataObj.req.body.phone_numb), dataObj.idTitle, dataObj.idDataStatus, dataObj.idUserLevel, dataObj.idEntity],
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
                                processMsg: "A new user was added to the system, please wait for the admin confirmation that the user is valid.",
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
    return await new Promise((resolve) => {
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





/**
 *  Supports the login main function
 * @param {String} username Username unique to one user 
 * @returns object with a response code, fetch result and response error
 */
const loginFetchUserData = async (username) => {
    console.log(username);
    let processResp = {}
    await sequelize
        .query(`SELECT User.id_user,User.username,User.password, User_level.designation as user_level, User_status.designation as user_status FROM  ((User INNER JOIN 
            User_status on User_status.id_status = User.id_status)INNER JOIN  User_level on User_level.id_user_level = User.id_user_level ) where User.username =:username`, {
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


}



















module.exports = {
    initUser,
    fetchIdUserByUsername,
    proceedUserLogin,
    proceedUserRegister

}