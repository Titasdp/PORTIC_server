const UserModel = require("../Models/User")
const sequelize = require("../Database/connection")
const tokenPack = require("../Middleware/tokenFunctions")
const passwordPack = require("../Middleware/randomPasswordFunctions")
const encryptPack = require("../Middleware/encrypt")



userLogin = (dataObj, callback) => {
    let processResp = {}

    encryptPack.decryptPassword({
        password: dataObj.req.Sanitize(req.body.password),
        hash: dataObj.userData.password,
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
            return callback(false, processResp)

        } else {
            if (decryptResult) {
                tokenPack.generateToken({
                        user: {
                            id: dataObj.userData.id_user,
                            userCode: "PORTICIPPASSOCIATION"
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
                                processMsg: "Successful Login",
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



















module.exports = {}