const EntityModel = require("../Models/Entity")
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")
// Controllers
const menuController = require("./menuController")
const entityEmailController = require("./entityEmailController")
const entityContactController = require("./entityContactController")
const socialMediaController = require("./socialMediaController")
const pictureController = require("../Controllers/pictureController")

//.ENV
require("dotenv").config();


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_entity FROM Entity", {
            model: EntityModel.Entity
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
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchFullEntityDataById = async (dataObj, callback) => {
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
        return callback(true, processResp)
    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng === "pt")) ? `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_pt as desc_html  ,Entity.slogan_pt as slogan,Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id,  Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img, Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube FROM((( Entity inner Join 
        Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
        Inner Join
        Picture on Picture.id_picture = Entity.id_logo)
        Inner Join
        Data_Status on Data_Status.id_status= Entity.id_status) where Entity.id_entity = :id_entity
        ` : `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_eng as desc_html  ,Entity.slogan_eng as slogan, Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id, Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img ,Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube FROM((( Entity inner Join 
        Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
        Inner Join
        Picture on Picture.id_picture = Entity.id_logo)
        Inner Join
        Data_Status on Data_Status.id_status= Entity.id_status)  where Entity.id_entity =:id_entity;`;

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: EntityModel.Entity
        })
        .then(async data => {

            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
                let processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return callback(true, processResp)
            } else {
                console.log(data);
                let entityObj = {
                    id_entity: data[0][0].id_entity,
                    designation: data[0][0].designation,
                    initials: data[0][0].initials,
                    desc_html: data[0][0].desc_html,
                    slogan: data[0][0].slogan,
                    postal_code: data[0][0].postal_code,
                    street: data[0][0].street,
                    lat: data[0][0].lat,
                    long: data[0][0].long,
                    highlights: [data[0][0].hightLight_1_id, data[0][0].hightLight_2_id, data[0][0].hightLight_3_id],
                    colors: data[0][0].colors,
                    menus: [],
                    contacts: [],
                    emails: [],
                    social_medias: [],
                    img: process.env.API_URL + data[0][0].img,
                    emails: [data[0][0].main_email, data[0][0].secondary_email],
                    contacts: [data[0][0].main_contact],
                    social_medias: {
                        Facebook: data[0][0].facebook,
                        Instagram: data[0][0].instagram,
                        LinkedIn: data[0][0].linkedIn,
                        Twitter: data[0][0].twitter,
                        Youtube: data[0][0].youtube,
                    },
                }
                let menuFetch = await menuController.fetchEntityMenus({
                    req: dataObj.req
                })

                console.log(menuFetch);

                entityObj.menus = menuFetch.toClient.processResult
                let processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: [entityObj],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return callback(true, processResp)

            }
        })
        .catch(error => {
            console.log(error);
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
 * Initialize the table Entity by introducing predefined data to it.
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntity = async (dataObj) => {
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

    if (dataObj.idDataStatus === null || dataObj.idEntityLevel === null) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: false,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp
    }



    let idLogoFetchResult = await pictureController.initAddMultipleImgs({
        insertArray: [`/Images/Logos/logoPortic.png`]
    })

    if (idLogoFetchResult.processRespCode === 500) {
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



    let insertArray = [
        [uniqueIdPack.generateRandomId('_Entity'), `Porto Research, Technology & Innovation Center`, `PORTIC`, `<p><span wfd-id="217">O PORTIC -Porto Research, Technology &amp; Innovation Center </span>visa agregar vários centros e grupos de investigação das escolas do P.PORTO num único espaço físico, configurando uma superestrutura dedicada à investigação, transferência de tecnologia, inovação e empreendedorismo. Alojará ainda a Porto Global Hub que integra a Porto Design Factory, a Porto Business Innovation e a Startup Porto e que tem como visão ajudar a criação de projetos locais sustentáveis para uma vida melhor.</p>`, `<p> <span wfd-id = "217"> THE PORTIC -Porto Research, Technology & amp; Innovation Center </span> aims to bring together several research centers and groups from the schools of P.PORTO in a single physical space, configuring a superstructure dedicated to research, technology transfer, innovation and entrepreneurship. It will also host the Porto Global Hub that integrates Porto Design Factory, Porto Business Innovation and Startup Porto and that aims to help create sustainable local projects for a better life. </p>`, `An open door towards the future`, `Uma porta aberta para o futuro`, dataObj.idEntityLevel, idLogoFetchResult.toClient.processResult.generatedIds[0], dataObj.idDataStatus],
    ]
    await sequelize
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
    return processResp
}



/**
 * Fetches id of the main entity
 * @returns object of data
 */
const fetchMainEntityId = async () => {
    let processResp = {}
    let query = `SELECT id_entity  FROM (Entity inner join Entity_level on Entity_level.id_entity_level = Entity.id_entity_level) Where Entity_level.designation= 'Primary' ;`
    await sequelize
        .query(query, {
            model: EntityModel.Entity
        })
        .then(data => {

            console.log(data);
            let returnArray = [];
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                // respCode = 201
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                returnArray = data[0]
            }
            console.log(returnArray);

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: returnArray,
                    processError: null,
                    processMsg: respMsg,
                }
            }

            console.log(processResp);


        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp
};



/**
 * fetches the id of an entity based on a specific designation 
 * @param {String} designation designation of an entity
 * @returns object of data 
 */
const fetchEntityIdByDesignation = async (designation) => {
    let processResp = {}
    await sequelize
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
                    processResult: error,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });


    return processResp
};


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!New!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * Fetches all entities initials on the database
 * Status:Completed
 * @returns obj of data
 */
const fetchAllEntitiesInitials = async () => {
    let processResp = {}
    await sequelize
        .query("SELECT Entity.initials FROM Entity", {
            model: EntityModel.Entity
        })
        .then(data => {
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: 200,
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
 * Fetches the id of an specific entity based on his initials
 * Status:Completed
 * @returns obj of data
 */
const fetchEntityIdByInitials = async (initials) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_entity FROM Entity where initials =:initials", {
            replacements: {
                initials: initials
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




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Admin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/**
 * edit Project  
 * Status: Complete
 */
const editEntity = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_eng) ||
        !dataObj.req.sanitize(dataObj.req.body.slogan_eng) || !dataObj.req.sanitize(dataObj.req.body.slogan_pt) || !dataObj.req.sanitize(dataObj.req.body.colors) || !dataObj.req.sanitize(dataObj.req.body.main_email) ||
        !dataObj.req.sanitize(dataObj.req.body.secondary_email) || !dataObj.req.sanitize(dataObj.req.body.main_contact) || !dataObj.req.sanitize(dataObj.req.body.linkedIn) || !dataObj.req.sanitize(dataObj.req.body.facebook) ||
        !dataObj.req.sanitize(dataObj.req.body.facebook) || !dataObj.req.sanitize(dataObj.req.body.facebook) || !dataObj.req.sanitize(dataObj.req.body.facebook) || !dataObj.req.sanitize(dataObj.req.body.facebook)
    ) {
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

    await sequelize
        .query(
            `UPDATE Project SET designation=:designation,initials=:initials, desc_html_pt =:desc_html_pt, desc_html_eng =:desc_html_eng,slogan_eng=:slogan_eng,slogan_pt=:slogan_pt,
            colors=:colors,  main_email=:main_email,secondary_email=:secondary_email,main_contact=:main_contact , main_contact=:main_contact,linkedIn=:linkedIn,facebook=:facebook,instagram=:instagram ,twitter=:twitter,youtube=:youtube Where Project.id_project=:id_project`, {
                replacements: {
                    id_entity: dataObj.req.sanitize(dataObj.req.params.id),
                    designation: dataObj.req.sanitize(dataObj.req.body.designation),
                    initials: dataObj.req.sanitize(dataObj.req.body.initials),
                    desc_html_pt: dataObj.req.sanitize(dataObj.req.body.desc_html_pt),
                    desc_html_eng: dataObj.req.sanitize(dataObj.req.body.desc_html_eng),
                    slogan_eng: dataObj.req.sanitize(dataObj.req.body.slogan_eng),
                    slogan_pt: dataObj.req.sanitize(dataObj.req.body.slogan_pt),
                    colors: dataObj.req.sanitize(dataObj.req.body.colors),
                    main_email: dataObj.req.sanitize(dataObj.req.body.main_email),
                    secondary_email: dataObj.req.sanitize(dataObj.req.body.secondary_email),
                    main_contact: dataObj.req.sanitize(dataObj.req.body.main_contact),
                    linkedIn: dataObj.req.sanitize(dataObj.req.body.linkedIn),
                    facebook: dataObj.req.sanitize(dataObj.req.body.facebook),
                    instagram: dataObj.req.sanitize(dataObj.req.body.instagram),
                    youtube: dataObj.req.sanitize(dataObj.req.body.youtube),
                    twitter: dataObj.req.sanitize(dataObj.req.body.twitter),
                }
            }, {
                model: ProjectModel.Project
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The Area was updated successfully",
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




module.exports = {
    fetchMainEntityId,
    initEntity,
    // fetchEntityIdByName,
    fetchFullEntityDataById,
    fetchEntityIdByDesignation,
    //
    fetchAllEntitiesInitials,
    // 
    editEntity
}












/**
 * Fetches an entity id based on a entity name
 * Status: Completed
 * @param {String} designation The name of the entity
 * @param {Callback} callback 
 */
//  const fetchEntityIdByName = (designation, callback) => {
//     sequelize
//         .query("SELECT id_entity FROM Entity where designation =:designation", {
//             replacements: {
//                 designation: designation
//             }
//         }, {
//             model: EntityModel.Entity
//         })
//         .then(data => {

//             let respCode = 200;
//             let respMsg = "Fetched successfully."
//             if (data[0].length === 0) {
//                 respCode = 204
//                 respMsg = "Fetch process completed successfully, but there is no content."
//             }
//             let processResp = {
//                 processRespCode: respCode,
//                 toClient: {
//                     processResult: data[0],
//                     processError: null,
//                     processMsg: respMsg,
//                 }
//             }
//             return callback(true, processResp)
//         })
//         .catch(error => {
//             let processResp = {
//                 processRespCode: 500,
//                 toClient: {
//                     processResult: null,
//                     processError: null,
//                     processMsg: "Something when wrong please try again later",
//                 }
//             }
//             return callback(false, processResp)
//         });
// };