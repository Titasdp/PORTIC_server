//Main modes
const UserModel = require("../Models/User")
//Database Connection
const sequelize = require("../Database/connection")
// Middleware
const tokenPack = require("../Middleware/tokenFunctions")
// const passwordPack = require("../Middleware/randomPasswordFunctions")
const encryptPack = require("../Middleware/encrypt")
const uniqueIdPack = require("../Middleware/uniqueId");
const generatePassPack = require("../Middleware/randomPasswordFunctions")
// const fsPack = require("../Middleware/fsFunctions")
//Controllers
const pictureController = require("../Controllers/pictureController")
const entityController = require("../Controllers/entityController")
const userLevelController = require("../Controllers/userLevelController")
const userStatusController = require("../Controllers/userStatusController")
//Env
require("dotenv").config();

const {
    Entity
} = require("../Models/Entity")


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

/**
 * Confirms if params has been taken Assist the login , Register back up 
 * Status :Completed 
 * @param {Obj} dataObj Contains Multiple data
 * @returns 
 */
const confirmUserExistentByParams = async (dataObj) => {

    let processResp = {}
    let arrayOfColumn = ['username', 'phone_numb', 'email']
    let responses = ['The username has already been taken.', 'The phone  number is already associated with another account.', 'The email is already associated with another account.']
    for (let i = 0; i < 3; i++) {
        let confirmExistenceResponse = await confirmParamsValueTaken({
            selectedField: arrayOfColumn[i],
            substitute: dataObj.paramsValueArray[i],
            id_user: dataObj.id_user,
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
const confirmParamsValueTaken = async (dataObj) => {
    let processResp = {}

    let query = (dataObj.id_user === null) ? `SELECT id_user FROM User where ${dataObj.selectedField} =:substitute` : `SELECT id_user FROM User where ${dataObj.selectedField} =:substitute and User.id_user !=:id_user`

    await sequelize
        .query(query, {
            replacements: {
                substitute: dataObj.substitute,
                id_user: dataObj.id_user
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
    let id_user_level = fetchResult.toClient.processResult[0].id_user_level
    let id_entity = fetchResult.toClient.processResult[0].id_entity

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
                            user_code: "PORTIC_IPP_ASSOCIATION",
                            id_user_level: id_user_level,
                            id_entity: id_entity
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
 *  Supports the login main function
 * @param {String} username Username unique to one user 
 * @returns object with a response code, fetch result and response error
 */
const loginFetchUserData = async (username) => {
    console.log(username);
    let processResp = {}
    await sequelize
        .query(`SELECT User.id_user,User.username,User.password, User_level.designation as user_level, User_status.designation as user_status, User_level.id_user_level, User.id_entity  FROM  ((User INNER JOIN 
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



/**
 * Realizes the process to login an user 
 * Status:Completed
 * @param {Obj} dataObj Object whit multiple data
 * @returns Obj
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


    let confirmUserExistentByParamsResult = await confirmUserExistentByParams({
        paramsValueArray: [dataObj.req.sanitize(dataObj.req.body.username), dataObj.req.sanitize(dataObj.req.body.phone_numb), dataObj.req.sanitize(dataObj.req.body.email)],
        id_user: null
    })
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



    return await new Promise(async (resolve) => {
        await encryptPack.encryptPassword(dataObj.req.sanitize(dataObj.req.body.password), async (encryptError, encryptResult) => {
            if (encryptError) {
                console.log(encryptResult);
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
                await sequelize
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

/**
 * Initialize the table user by adding to the table
 * @param {*} dataObj 
 * @returns 
 */
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
    return await new Promise(async (resolve) => {
        await encryptPack.encryptPassword("porticSuperAdmin", async (encryptError, encryptResult) => {
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
                await sequelize
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
 * Fetch all users for de admin 
 * Status:Completed
 * @param {object} dataObj Object with multiple  Object whit multiple data 
 * @returns 
 */
const fetchAllUsers = async (dataObj) => {
    let processResp = {}
    let query = (dataObj.user_level === `Super Admin`) ? ` SELECT User.id_user,User.post,User.username, User.full_name, User.description_eng, User.description_pt,User.email, User.phone_numb,  User.linkedIn_url, User.created_at, User.updated_at, User.id_picture, Entity.initials as entity_initials, User_level.designation as user_level, User_status.designation as user_status FROM  ((((User INNER JOIN 
        User_status on User_status.id_status = User.id_status))INNER JOIN  User_level on User_level.id_user_level = User.id_user_level ) INNER JOIN Entity ON Entity.id_entity = User.id_entity)` : ` SELECT User.id_user,User.post,User.username,User.full_name, User.description_eng, User.description_pt,User.email, User.phone_numb,  User.linkedIn_url, User.created_at, User.updated_at, User.id_picture, Entity.initials as entity_initials, User_level.designation as user_level, User_status.designation as user_status FROM  ((((User INNER JOIN 
            User_status on User_status.id_status = User.id_status))INNER JOIN  User_level on User_level.id_user_level = User.id_user_level ) INNER JOIN Entity ON Entity.id_entity = User.id_entity) where Entity.id_entity = :id_entity`

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity,
            }
        }, {
            model: UserModel.User
        })
        .then(async data => {
            let users = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let userObj = {
                        id_user: el.id_user,
                        username: el.username,
                        full_name: el.full_name,
                        description_eng: el.description_eng,
                        description_pt: el.description_pt,
                        post: el.post,
                        email: el.email,
                        phone_numb: el.phone_numb,
                        linkedIn_url: el.linkedIn_url,
                        created_at: el.created_at,
                        updated_at: el.updated_at,
                        user_level: el.user_level,
                        user_status: el.user_status,
                        user_entity: el.entity_initials,
                        picture: null,
                    }
                    if (el.id_picture !== null) {
                        let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);
                        userObj.picture = process.env.API_URL + fetchImgResult.toClient.processResult
                    }
                    users.push(userObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: users,
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


/**
 * Fetch Specific user data 
 * Status:Completed
 * @param {object} dataObj Object with multiple  Object whit multiple data 
 * @returns 
 */
const fetchUserProfileById = async (dataObj) => {
    // var today = new Date();
    // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // console.log(`${date} ${time}`);
    let query = `SELECT User.id_user,User.username,User.post,User.full_name, User.description_eng, User.description_pt,User.email, User.phone_numb, User.linkedIn_url, User.id_picture, Entity.initials as entity_initials FROM  (User INNER JOIN Entity ON Entity.id_entity = User.id_entity) where User.id_user=:id_user;`
    await sequelize
        .query(query, {
            replacements: {
                id_user: dataObj.id_user,
            }
        }, {
            model: UserModel.User
        })
        .then(async data => {
            let users = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    console.log(el.id_picture);


                    let userObj = {
                        id_user: el.id_user,
                        username: el.username,
                        full_name: el.full_name,
                        description_eng: el.description_eng,
                        description_pt: el.description_pt,
                        email: el.email,
                        post: el.post,
                        phone_numb: el.phone_numb,
                        linkedIn_url: el.linkedIn_url,
                        created_at: el.created_at,
                        updated_at: el.updated_at,
                        user_level: el.user_level,
                        user_status: el.user_status,
                        picture: null
                    }
                    if (el.id_picture !== null) {
                        let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);
                        userObj.picture = process.env.API_URL + fetchImgResult.toClient.processResult
                    }
                    users.push(userObj)

                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: users,
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



// Todo NEW 
/**
 * Fetches user data based on his username 
 * Status: Complete
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
 * edit user profile fields present in  
 * Status: Complete
 */
const editUserProfileByAdminOrProfileOwner = async (dataObj) => {
    let processResp = {}


    if (!dataObj.id_user || !dataObj.req.sanitize(dataObj.req.body.username) || !dataObj.req.sanitize(dataObj.req.body.email) || !dataObj.req.sanitize(dataObj.req.body.phone_numb) || !dataObj.req.sanitize(dataObj.req.body.linkedIn_url) || !dataObj.req.sanitize(dataObj.req.body.description_pt) || !dataObj.req.sanitize(dataObj.req.body.description_eng) || !dataObj.req.sanitize(dataObj.req.body.full_name)) {
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

    if (dataObj.req.sanitize(dataObj.req.body.username) === "" || dataObj.req.sanitize(dataObj.req.body.email) === "" || dataObj.req.sanitize(dataObj.req.body.phone_numb) === "") {
        processResult = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Process cannot be completed please fill the require field."
            }
        }
        return processResult
    }



    let confirmUserExistentByParamsResult = await confirmUserExistentByParams({
        paramsValueArray: [dataObj.req.sanitize(dataObj.req.body.username), dataObj.req.sanitize(dataObj.req.body.phone_numb), dataObj.req.sanitize(dataObj.req.body.email)],
        id_user: dataObj.id_user,
    })
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

    await sequelize
        .query(
            `UPDATE User SET username = :username,post =:post ,full_name =:full_name, description_eng =:description_eng, description_pt =:description_pt, email=:email,phone_numb=:phone_numb ,linkedIn_url =:linkedIn_url  Where User.id_user=:id_user `, {
                replacements: {
                    id_user: dataObj.id_user,
                    username: dataObj.req.sanitize(dataObj.req.body.username),
                    description_pt: dataObj.req.sanitize(dataObj.req.body.description_pt),
                    description_eng: dataObj.req.sanitize(dataObj.req.body.description_eng),
                    email: dataObj.req.sanitize(dataObj.req.body.email),
                    phone_numb: dataObj.req.sanitize(dataObj.req.body.phone_numb),
                    linkedIn_url: dataObj.req.sanitize(dataObj.req.body.linkedIn_url),
                    full_name: dataObj.req.sanitize(dataObj.req.body.full_name),
                    post: (!dataObj.req.sanitize(dataObj.req.body.post)) ? null : dataObj.req.sanitize(dataObj.req.body.post),
                }
            }, {
                model: UserModel.User
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    // {
                    //     // pt_answer: "Perfil actualizado com sucesso!",
                    //     // en_answer: "Profile updated Successfully"
                    // },
                    processError: null,
                    processMsg: "The user was updated successfully",
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
 * Patch user Status
 * StatusCompleted
 */
const updateUserStatus = async (dataObj) => {
    console.log(dataObj.req.body);
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


    let fetchResult = await userStatusController.fetchUserStatusIdByDesignation(dataObj.req.sanitize(dataObj.req.body.new_status))
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
            `UPDATE User SET User.id_status =:id_status  Where User.id_user=:id_user `, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_user: dataObj.id_user
                }
            }, {
                model: UserModel.User
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
 * Patch user Entity
 * StatusCompleted
 */
const updateUserEntity = async (dataObj) => {
    console.log("body:");
    console.log(dataObj.req.body);
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.entity_initials)) {
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


    let fetchResult = await entityController.fetchEntityIdByInitials(dataObj.req.sanitize(dataObj.req.body.entity_initials))
    console.log("fetchResult:");
    console.log(fetchResult.toClient.processResult);

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
            `UPDATE User SET User.id_entity =:id_entity  Where User.id_user=:id_user `, {
                replacements: {
                    id_entity: fetchResult.toClient.processResult[0].id_entity,
                    id_user: dataObj.id_user
                }
            }, {
                model: UserModel.User
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
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

// userLevelController
/**
 * Patch user Entity
 * StatusCompleted
 */
const updateUserLevel = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.user_level)) {
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


    let fetchResult = await userLevelController.fetchUserLevelIdByDesignation(dataObj.req.sanitize(dataObj.req.body.user_level))
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
            `UPDATE User SET User.id_user_level =:id_user_level  Where User.id_user=:id_user `, {
                replacements: {
                    id_user_level: fetchResult.toClient.processResult[0].id_user_level,
                    id_user: dataObj.id_user
                }
            }, {
                model: UserModel.User
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
 * Patch user picture
 * @param {Obj } dataObj Object of data      
 * @returns Obj of data
 */
const updateUserProfilePicture = async (dataObj) => {
    let fetchResult = await fetchUserImgByUserId(dataObj.req.sanitize(dataObj.id_user))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await pictureController.updatePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/UserProfilePicture/`
    })


    if (uploadResult.processRespCode !== 201) {
        console.log(uploadResult);
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE User SET User.id_picture =:id_picture  Where User.id_user=:id_user `, {
                    replacements: {
                        id_picture: uploadResult.toClient.processResult.generatedId,
                        id_user: dataObj.id_user
                    }
                }, {
                    model: UserModel.User
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
}









//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchUserImgByUserId = async (id_user) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_picture FROM User where id_user =:id_user", {
            replacements: {
                id_user: id_user
            }
        }, {
            model: UserModel.User
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
                    processResult: ((!data[0][0].id_picture) ? null : data[0][0].id_picture),
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




//*Complement
/**
 * Fetches user password based on his id 
 * Status: Complete
 */
const fetchUserPasswordByUserId = async (id_user) => {
    let processResp = {}
    await sequelize
        .query("SELECT password FROM User where id_user =:id_user", {
            replacements: {
                id_user: id_user
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
            // console.log(data[0].id_picture);
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
 * Update user profile password
 * Status : Completed
 */
const updateUserPassword = async (dataObj) => {
    let processResp = {}
    if (!dataObj.idUser === null || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.old_password) || !dataObj.req.sanitize(dataObj.req.body.new_password)) {
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

    let fetchResult = await fetchUserPasswordByUserId(dataObj.idUser)

    if (fetchResult.processRespCode !== 200) {
        return fetchResult
    }
    return await new Promise(async (resolve) => {
        await encryptPack.decryptPassword({
            password: dataObj.req.sanitize(dataObj.req.body.old_password),
            hash: fetchResult.toClient.processResult[0].password
        }, (isError, decryptResult) => {
            if (isError) {
                console.log(decryptResult);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong, please try again later.",
                    }
                }
                resolve(processResp)
            } else {
                if (decryptResult) {
                    encryptPack.encryptPassword(dataObj.req.sanitize(dataObj.req.body.new_password), (isErrorEncrypting, encryptResult) => {
                        if (isErrorEncrypting) {
                            processResp = {
                                processRespCode: 500,
                                toClient: {
                                    processResult: null,
                                    processError: null,
                                    processMsg: "Something went wrong, please try again later.",
                                }
                            }
                            resolve(processResp)
                        } else {


                            sequelize
                                .query(
                                    "UPDATE User SET password = :new_password  Where user.id_user = :id_user", {
                                        replacements: {
                                            id_user: dataObj.idUser,
                                            new_password: encryptResult,
                                        }
                                    }, {
                                        model: UserModel.User
                                    }
                                )
                                .then(data => {
                                    processResp = {
                                        processRespCode: 200,
                                        toClient: {
                                            processResult: data[0],
                                            processError: null,
                                            processMsg: "User password updated successfully.",
                                        }
                                    }
                                    resolve(processResp)

                                })
                                .catch(error => {
                                    console.log(error);
                                    processResp = {
                                        processRespCode: 500,
                                        toClient: {
                                            processResult: null,
                                            processError: null,
                                            processMsg: "Something went wrong please ty again later.",
                                        }
                                    }

                                    resolve(processResp)
                                });
                        }
                    })
                } else {
                    processResp = {
                        processRespCode: 400,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "The actual password doesn't match our records",
                        }
                    }
                    resolve(processResp)
                }
            }
        })
    })
};




/**
 * Update user profile password
 * Status : Completed
 */
const refreshUserPassword = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id)) {
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

    let generatedPassword = generatePassPack.generateRandomPass()
    return await new Promise(async (resolve) => {
        await encryptPack.encryptPassword(generatedPassword, async (isErrorEncrypting, encryptResult) => {
            if (isErrorEncrypting) {
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong, please try again later.",
                    }
                }
                resolve(processResp)
            } else {
                await sequelize
                    .query(
                        "UPDATE User SET password = :new_password  Where User.id_user = :id_user", {
                            replacements: {
                                id_user: dataObj.req.sanitize(dataObj.req.params.id),
                                new_password: encryptResult,
                            }
                        }, {
                            model: UserModel.User
                        }
                    )
                    .then(data => {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: generatedPassword,
                                processError: null,
                                processMsg: "User password updated successfully.",
                            }
                        }
                        resolve(processResp)

                    })
                    .catch(error => {
                        console.log(error);
                        processResp = {
                            processRespCode: 500,
                            toClient: {
                                processResult: null,
                                processError: null,
                                processMsg: "Something went wrong please ty again later.",
                            }
                        }

                        resolve(processResp)
                    });
            }
        })
    })
};

























module.exports = {
    initUser,
    fetchIdUserByUsername,
    proceedUserLogin,
    proceedUserRegister,

    // BackLog
    fetchAllUsers,
    fetchUserProfileById,
    editUserProfileByAdminOrProfileOwner,
    updateUserProfilePicture,
    updateUserStatus,

    refreshUserPassword,
    updateUserPassword,

    updateUserLevel,
    updateUserEntity


}