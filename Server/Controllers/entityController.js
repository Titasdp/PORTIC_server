const EntityModel = require("../Models/Entity")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")
const menuController = require("./menuController")
const entityEmailController = require("./entityEmailController")
const entityContactController = require("./entityContactController")
const socialMediaController = require("./socialMediaController")
/**
 * Function that fetch all entity from the Database
 * Done
 * Admin Only
 */
fetchAllEntity = (receivedObj, callback) => {
    let query = ""
        (receivedObj.selected_lang = "eng") ? query = `SELECT * FROM User_title where designation_eng = :designation_eng` : query = `SELECT * FROM User_title where designation_pt = :designation_pt`;

    sequelize
        .query("SELECT * FROM User_title", {
            model: UserTitleModel.User_title
        })
        .then(data => {
            let processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Fetched successfully",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};

/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchFullEntityDataById = (dataObj, callback) => {
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

    }


    processResp = {
        processRespCode: 200,
        toClient: {
            processResult: dataObj.req.params.lng === "pt" + " " + dataObj.req.params.id,
            processError: null,
            processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
        }
    }

    return callback(false, processResp)

    // let query = (dataObj.req.sanitize(dataObj.req.params.lng === "pt")) ? `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_pt as desc_html  ,Entity.slogan_pt as slogan,Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id,  Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img FROM((( Entity inner Join 
    //     Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
    //     Inner Join
    //     Picture on Picture.id_picture = Entity.id_logo)
    //     Inner Join
    //     Data_Status on Data_Status.id_status= Entity.id_status)  where Entity.id_entity =:id_entity;` : `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_eng as desc_html  ,Entity.slogan_eng as slogan, Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id, Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img FROM((( Entity inner Join 
    //     Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
    //     Inner Join
    //     Picture on Picture.id_picture = Entity.id_logo)
    //     Inner Join
    //     Data_Status on Data_Status.id_status= Entity.id_status)  where Entity.id_entity =:id_entity;`;

    // sequelize
    //     .query(query, {
    //         replacements: {
    //             id_entity: dataObj.req.sanitize(dataObj.req.params.id)
    //         }
    //     }, {
    //         model: EntityModel.Entity
    //     })
    //     .then(data => {

    //         let respCode = 200;
    //         let respMsg = "Fetched successfully."
    //         if (data[0].length === 0) {
    //             respCode = 204
    //             respMsg = "Fetch process completed successfully, but there is no content."
    //             let processResp = {
    //                 processRespCode: respCode,
    //                 toClient: {
    //                     processResult: data[0],
    //                     processError: null,
    //                     processMsg: respMsg,
    //                 }
    //             }
    //             return callback(true, processResp)
    //         } else {
    //             let entityObj = {
    //                 id_entity: data[0][0].id_entity,
    //                 designation: data[0][0].designation,
    //                 initials: data[0][0].initials,
    //                 desc_html: data[0][0].desc_html,
    //                 slogan: data[0][0].slogan,
    //                 postal_code: data[0][0].postal_code,
    //                 street: data[0][0].street,
    //                 lat: data[0][0].lat,
    //                 long: data[0][0].long,
    //                 highlights: [data[0][0].hightLight_1_id, data[0][0].hightLight_2_id, data[0][0].hightLight_3_id],
    //                 colors: data[0][0].colors,
    //                 menus: [],
    //                 contacts: [],
    //                 emails: [],
    //                 social_medias: [],
    //             }
    //             fsPack.fileFetch({
    //                 path: data[0][0].img
    //             }, (fsSuccess, fsResult) => {
    //                 if (fsSuccess) {
    //                     entityObj.img = fsResult.toClient.processResult
    //                 }
    //                 menuController.fetchEntityMenus({
    //                     req: dataObj.req
    //                 }, (fetchSuccess, fetchResult) => {
    //                     if (fetchSuccess) {
    //                         entityObj.menus = fetchResult.toClient.processResult
    //                     }
    //                     entityEmailController.fetchEntityEmails({
    //                         req: dataObj.req
    //                     }, (fetchSuccess, fetchResult) => {
    //                         if (fetchSuccess) {
    //                             entityObj.emails = fetchResult.toClient.processResult
    //                         }
    //                         entityContactController.fetchEntityContacts({
    //                             req: dataObj.req
    //                         }, (fetchSuccess, fetchResult) => {
    //                             if (fetchSuccess) {
    //                                 entityObj.contacts = fetchResult.toClient.processResult
    //                             }

    //                             socialMediaController.fetchEntitySocialMedia({
    //                                 req: dataObj.req
    //                             }, (fetchSuccess, fetchResult) => {
    //                                 if (fetchSuccess) {
    //                                     entityObj.social_medias = fetchResult.toClient.processResult
    //                                 }
    //                                 let processResp = {
    //                                     processRespCode: respCode,
    //                                     toClient: {
    //                                         processResult: [entityObj],
    //                                         processError: null,
    //                                         processMsg: respMsg,
    //                                     }
    //                                 }
    //                                 return callback(true, processResp)
    //                             })

    //                         })

    //                     })
    //                 })
    //             })
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         let processResp = {
    //             processRespCode: 500,
    //             toClient: {
    //                 processResult: null,
    //                 processError: null,
    //                 processMsg: "Something when wrong please try again later",
    //             }
    //         }
    //         return callback(false, processResp)
    //     });
};


/**
 * Fetches an entity id based on a entity name
 * Status: Completed
 * @param {String} designation The name of the entity
 * @param {Callback} callback 
 */
const fetchEntityIdByName = (designation, callback) => {
    sequelize
        .query("SELECT id_entity FROM Entity where designation =:designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: EntityModel.Entity
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
 * Initialize the table Entity by introducing predefined data to it.
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntity = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idDataStatus === null || dataObj.idEntityLevel === null || dataObj.idLogo === null) {

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

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Entity'), `Porto Research, Technology & Innovation Center`, `PORTIC`, `<p><span wfd-id="217">O PORTIC -Porto Research, Technology &amp; Innovation Center </span>visa agregar vários centros e grupos de investigação das escolas do P.PORTO num único espaço físico, configurando uma superestrutura dedicada à investigação, transferência de tecnologia, inovação e empreendedorismo. Alojará ainda a Porto Global Hub que integra a Porto Design Factory, a Porto Business Innovation e a Startup Porto e que tem como visão ajudar a criação de projetos locais sustentáveis para uma vida melhor.</p>`, `<p> <span wfd-id = "217"> THE PORTIC -Porto Research, Technology & amp; Innovation Center </span> aims to bring together several research centers and groups from the schools of P.PORTO in a single physical space, configuring a superstructure dedicated to research, technology transfer, innovation and entrepreneurship. It will also host the Porto Global Hub that integrates Porto Design Factory, Porto Business Innovation and Startup Porto and that aims to help create sustainable local projects for a better life. </p>`, `An open door towards the future`, `Uma porta aberta para o futuro`, dataObj.idEntityLevel, dataObj.idLogo, dataObj.idDataStatus],
    ]
    sequelize
        .query(
            `INSERT INTO Entity (id_entity,designation,initials,desc_html_pt,desc_html_eng,slogan_eng,slogan_pt,id_entity_level,id_logo,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityModel.Entity
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


module.exports = {
    initEntity,
    fetchEntityIdByName,
    fetchFullEntityDataById
}