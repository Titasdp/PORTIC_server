// Models
const jwt = require("jsonwebtoken");
//Controllers
const userLevelController = require("../Controllers/userLevelController")
const generateToken = (user_info, callback) => {
    let secret = process.env.SECRET;
    let token = jwt.sign({
            data: user_info
        },
        secret, {
            expiresIn: "24h"
        }
    );
    return callback(token);
};

const validateToken = (token, callback) => {
    if (!token) {
        return callback(false);
    }
    let secret = process.env.SECRET;
    jwt.verify(token.replace("Bearer ", ""), secret, function (error, decoded) {
        if (error) {
            return callback(false);
        } else {
            return callback(true);
        }
    });
};


const validateTokenForUsersMaxSecurity = async (token) => {
    console.log("Token");
    console.log(token);
    let processResp = {}
    if (!token) {
        processResp = {
            processRespCode: 401,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The user is unauthorized of completing this function.",
            }
        }
        return processResp
    }

    let secret = process.env.SECRET;
    return await new Promise(async (resolve, reject) => {
        await jwt.verify(token.replace("Bearer ", ""), secret, async (error, decoded) => {
            if (error) {
                console.log(error);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: error.message,
                    }
                }
                resolve(processResp);
            } else {
                // if (decoded ) {

                if (!decoded.data.user_data) {
                    processResp = {
                        processRespCode: 401,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "Invalid Token!",
                        }
                    }
                } else {
                    if (!decoded.data.user_data.id_user || !decoded.data.user_data.user_level || !decoded.data.user_data.id_user_level || !decoded.data.user_data.id_entity || decoded.data.user_data.user_code !== `PORTIC_IPP_ASSOCIATION`) {
                        processResp = {
                            processRespCode: 401,
                            toClient: {
                                processResult: null,
                                processError: null,
                                processMsg: "Invalid Token!",
                            }

                        }
                    } else {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: decoded.data.user_data,
                                processError: null,
                                processMsg: "Valid token!",
                            }
                        }
                        let fetchResult = await userLevelController.fetchUserLevelIdByDesignation(decoded.data.user_data.user_level)

                        if (fetchResult.processRespCode === 500) {
                            resolve(fetchResult)
                        } else if (fetchResult.processRespCode === 204) {
                            processResp = {
                                processRespCode: 401,
                                toClient: {
                                    processResult: null,
                                    processError: null,
                                    processMsg: "Invalid token!",
                                }
                            }
                            resolve(processResp)
                        } else {

                            if (fetchResult.toClient.processResult[0].id_user_level !== decoded.data.user_data.id_user_level) {
                                processResp = {
                                    processRespCode: 401,
                                    toClient: {
                                        processResult: null,
                                        processError: null,
                                        processMsg: "Invalid token!",
                                    }
                                }
                            } else {
                                if (decoded.data.user_data.user_level !== 'Coord. Entidade' && decoded.data.user_data.user_level !== 'Super Admin') {
                                    processResp = {
                                        processRespCode: 401,
                                        toClient: {
                                            processResult: null,
                                            processError: null,
                                            processMsg: "The user is unauthorized of completing this function.",
                                        }
                                    }
                                }
                            }

                        }

                    }
                }
            }
            resolve(processResp)
        });

    })
};



const validateTokenForProfileFetch = async (token) => {
    let processResp = {}
    if (!token) {
        processResp = {
            processRespCode: 401,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The user is unauthorized of completing this function.",
            }
        }
        return processResp
    }

    let secret = process.env.SECRET;
    return await new Promise((resolve, reject) => {
        jwt.verify(token.replace("Bearer ", ""), secret, async (error, decoded) => {
            if (error) {
                console.log(error);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please try again later.",
                    }
                }
                resolve(processResp);
            } else {
                // if (decoded ) {

                if (!decoded.data.user_data) {
                    processResp = {
                        processRespCode: 401,
                        toClient: {
                            processResult: null,
                            processError: null,
                            processMsg: "Invalid Token-4!",
                        }
                    }
                } else {
                    if (!decoded.data.user_data.id_user || !decoded.data.user_data.user_level || !decoded.data.user_data.id_user_level || !decoded.data.user_data.id_entity || decoded.data.user_data.user_code !== `PORTIC_IPP_ASSOCIATION`) {
                        processResp = {
                            processRespCode: 401,
                            toClient: {
                                processResult: null,
                                processError: null,
                                processMsg: "Invalid Token!-1",
                            }
                        }
                    } else {
                        processResp = {
                            processRespCode: 200,
                            toClient: {
                                processResult: decoded.data.user_data,
                                processError: null,
                                processMsg: "Valid token!0",
                            }
                        }
                        let fetchResult = await userLevelController.fetchUserLevelIdByDesignation(decoded.data.user_data.user_level)

                        if (fetchResult.processRespCode === 500) {
                            resolve(fetchResult)
                        } else if (fetchResult.processRespCode === 204) {
                            processResp = {
                                processRespCode: 401,
                                toClient: {
                                    processResult: null,
                                    processError: null,
                                    processMsg: "Invalid token!1",
                                }
                            }
                            resolve(processResp)
                        } else {
                            if (fetchResult.toClient.processResult[0].id_user_level !== decoded.data.user_data.id_user_level) {
                                processResp = {
                                    processRespCode: 401,
                                    toClient: {
                                        processResult: null,
                                        processError: null,
                                        processMsg: "Invalid token!2",
                                    }
                                }
                            }
                        }

                    }
                }
            }
            resolve(processResp)
        });

    })
};

module.exports = {
    generateToken,
    validateTokenForUsersMaxSecurity,
    validateTokenForProfileFetch

};