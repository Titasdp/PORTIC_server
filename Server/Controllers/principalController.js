//Models
const PrincipalModel = require("../Models/Principal")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")



/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchPrincipalsByIdEntity = async (dataObj, callback) => {
    let processResp = {}

    if (!dataObj.req.sanitize(dataObj.req.params.lng) || !dataObj.req.params.id) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
            }
        }
        return callback(false, processResp)

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Principal.id_principal, Principal.title_pt as title, Principal.description_pt as description From Principal WHERE Principal.id_entity =:id_entity` : `SELECT Principal.id_principal, Principal.title_eng as title, Principal.description_eng as description  From Principal WHERE Principal.id_entity =:id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: PrincipalModel.Principal
        })
        .then(async data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return callback(true, processResp)
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
            return callback(false, processResp)
        });
};

/**
 * Initialize the table Principal by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initPrincipal = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, processResp)
    }
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_HiringTip'), `Trabalho em equipa`, `Teamwork`, `pt`, `eng`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Excelente Comunicação`, `Excellent Communication`, `pt`, `eng`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Responsabilidade`, `Responsibility`, `pt`, `eng`, dataObj.idUser, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Principal(id_principal,title_pt,title_eng,description_pt,description_eng,id_creator,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: PrincipalModel.Principal
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


/**
 * Fetches all Focus 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchPrincipals = (req, callback) => {
    sequelize
        .query("SELECT * FROM Principal", {
            model: PrincipalModel.Principal
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


module.exports = {
    initPrincipal,
    fetchPrincipals,
    fetchPrincipalsByIdEntity

}