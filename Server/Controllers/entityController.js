const EntityModel = require("../Models/Entity")
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")
// Controllers
const menuController = require("./menuController")
const dataStatusController = require("../Controllers/dataStatusController")
const pictureController = require("../Controllers/pictureController")
const entityLevelController = require("../Controllers/entityLevelController")

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




// Todo : Adjust to new format 
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

    let query = (dataObj.req.sanitize(dataObj.req.params.lng === "pt")) ? `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_pt as desc_html  ,Entity.slogan_pt as slogan,Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id,  Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img, Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube,
    Entity.optional_course_menu,Entity.optional_project_menu,Entity.optional_recruitment_menu,Entity.optional_media_menu
    FROM((( Entity inner Join 
        Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
        Inner Join
        Picture on Picture.id_picture = Entity.id_logo)
        Inner Join
        Data_Status on Data_Status.id_status= Entity.id_status) where Entity.id_entity = :id_entity
        ` : `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_eng as desc_html  ,Entity.slogan_eng as slogan, Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id, Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img ,Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube, Entity.optional_course_menu,Entity.optional_project_menu,Entity.optional_recruitment_menu,Entity.optional_media_menu FROM((( Entity inner Join 
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
                    social_medias: [{
                            url: data[0][0].facebook,
                            name: "Facebook"
                        },
                        {
                            url: data[0][0].instagram,
                            name: "Instagram"
                        },
                        {
                            url: data[0][0].linkedIn,
                            name: "LinkedIn"
                        },
                        {
                            url: data[0][0].twitter,
                            name: "Twitter"
                        },
                        {
                            url: data[0][0].youtube,
                            name: "Youtube"
                        },

                    ],
                }
                let notIn = `("xsxsxsxsxs"`
                // Some important validation
                if (data[0][0].optional_course_menu == 0) {
                    notIn += `,"Courses"`
                }

                if (data[0][0].optional_project_menu == 0) {
                    notIn += `,"ProjectsCatalog"`

                }
                if (data[0][0].optional_recruitment_menu == 0) {
                    notIn += `,"Positions"`
                }

                if (data[0][0].optional_media_menu == 0) {
                    notIn += `,"Media"`
                }
                notIn += `)`
                // 

                let menuFetch = await menuController.fetchEntityMenus({
                    req: dataObj.req,
                    notIn: notIn
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



/**
 * fetches the id of an entity based on a specific designation 
 * @param {String} designation designation of an entity
 * @returns object of data 
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




// /**
//  * Fetches the id of an specific entity based on his initials
//  * Status:Completed
//  * @returns obj of data
//  */
// const fetchEntityIdByInitials = async (initials) => {
//     let processResp = {}
//     await sequelize
//         .query("SELECT id_entity FROM Entity where initials =:initials", {
//             replacements: {
//                 initials: initials
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
//             processResp = {
//                 processRespCode: respCode,
//                 toClient: {
//                     processResult: data[0],
//                     processError: null,
//                     processMsg: respMsg,
//                 }
//             }

//         })
//         .catch(error => {
//             console.log(error);
//             processResp = {
//                 processRespCode: 500,
//                 toClient: {
//                     processResult: null,
//                     processError: null,
//                     processMsg: "Something when wrong please try again later",
//                 }
//             }

//         });
//     return processResp
// };




// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Admin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// Todo : Adjust to new format 
/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchEntitiesByAdmin = async (dataObj) => {
    let processResp = {}

    let query = (dataObj.user_level === `Super Admin`) ? `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_pt ,Entity.desc_html_eng, Entity.slogan_eng ,Entity.slogan_pt,Entity.hightLight_1_id,Entity.hightLight_2_id,Entity.hightLight_3_id ,Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id,  Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img, Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube, 
    Entity.optional_course_menu,Entity.optional_project_menu,Entity.optional_recruitment_menu,Entity.optional_media_menu, Entity_level.designation as entity_level, Data_Status.designation as data_status FROM((( Entity inner Join 
            Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
            Inner Join
            Picture on Picture.id_picture = Entity.id_logo)
            Inner Join
            Data_Status on Data_Status.id_status= Entity.id_status)` : `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Entity.desc_html_pt ,Entity.desc_html_eng, Entity.slogan_eng ,Entity.slogan_pt,Entity.hightLight_1_id,Entity.hightLight_2_id,Entity.hightLight_3_id ,Entity.colors,Entity.hightLight_1_id, Entity.hightLight_2_id,Entity.hightLight_3_id,  Entity.postal_code ,Entity.street, Entity.lat, Entity.long , Picture.img_path as img, Entity.main_email, Entity.secondary_email ,Entity.main_contact ,Entity.facebook,Entity.instagram,Entity.linkedIn, Entity.twitter,Entity.youtube, 
            Entity.optional_course_menu,Entity.optional_project_menu,Entity.optional_recruitment_menu,Entity.optional_media_menu, Entity_level.designation as entity_level, Data_Status.designation as data_status FROM((( Entity inner Join 
                    Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
                    Inner Join
                    Picture on Picture.id_picture = Entity.id_logo)
                    Inner Join
                    Data_Status on Data_Status.id_status= Entity.id_status) Where Entity.id_entity =:id_entity`;

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: EntityModel.Entity
        })
        .then(async data => {
            let entities = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let obj = {
                        id_entity: el.id_entity,
                        designation: el.designation,
                        initials: el.initials,
                        desc_html_pt: el.desc_html_pt,
                        desc_html_eng: el.desc_html_eng,
                        slogan_eng: el.slogan_eng,
                        slogan_pt: el.slogan_pt,
                        highlights: [el.hightLight_1_id, el.hightLight_2_id, el.hightLight_3_id],
                        colors: el.colors,
                        menus: [],
                        contacts: [],
                        emails: [],
                        social_medias: [],
                        img: process.env.API_URL + el.img,
                        emails: [el.main_email, el.secondary_email],
                        contacts: [el.main_contact],
                        social_medias: [{
                                url: el.facebook,
                                name: "Facebook"
                            },
                            {
                                url: el.instagram,
                                name: "Instagram"
                            },
                            {
                                url: el.linkedIn,
                                name: "LinkedIn"
                            },
                            {
                                url: el.twitter,
                                name: "Twitter"
                            },
                            {
                                url: el.youtube,
                                name: "Youtube"
                            },

                        ],
                        optional_course_menu: el.optional_course_menu,
                        optional_project_menu: el.optional_project_menu,
                        optional_recruitment_menu: el.optional_recruitment_menu,
                        optional_media_menu: el.optional_media_menu,
                        entity_level: el.entity_level,
                        data_status: el.data_status,
                    }

                    let menuFetch = await menuController.fetchEntityMenusByAdmin(el.id_entity)
                    if (menuFetch.processRespCode === 200) {
                        obj.menus = menuFetch.toClient.processResult
                    }
                    entities.push(obj)

                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: entities,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};






// Todo : Adjust to new format 
/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchAllSecondaryEntities = async (dataObj) => {
    let processResp = {}

    let query = `SELECT  Entity.id_entity, Entity.designation, Entity.initials, Picture.img_path as img  
    FROM((( Entity inner Join 
            Entity_level on Entity.id_entity_level= Entity_level.id_entity_level)
            Inner Join
            Picture on Picture.id_picture = Entity.id_logo)
            Inner Join
            Data_Status on Data_Status.id_status= Entity.id_status)
     where Entity_level.designation = "Secondary" and Data_Status.designation="Published";`
    await sequelize
        .query(query, {}, {
            model: EntityModel.Entity
        })
        .then(async data => {
            let entities = []
            let respCode = 200;
            let respMsg = "Fetched successfully."

            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                console.log("here");
                for (const el of data[0]) {
                    let obj = {
                        id_entity: el.id_entity,
                        designation: el.designation,
                        initials: el.initials,
                        img: process.env.API_URL + el.img,
                    }
                    entities.push(obj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: entities,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};













/**
 * edit Project  
 * Status: Complete
 */
const editEntity = async (dataObj) => {
    console.log(dataObj.req.params.id);
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_eng) ||
        !dataObj.req.sanitize(dataObj.req.body.slogan_eng) || !dataObj.req.sanitize(dataObj.req.body.slogan_pt) || !dataObj.req.sanitize(dataObj.req.body.colors) || !dataObj.req.sanitize(dataObj.req.body.main_email) ||
        !dataObj.req.sanitize(dataObj.req.body.secondary_email) || !dataObj.req.sanitize(dataObj.req.body.main_contact)) {
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



    let confirmUserExistentByParamsResult = await confirmUserExistentByParams({
        paramsValueArray: [dataObj.req.sanitize(dataObj.req.body.designation), dataObj.req.sanitize(dataObj.req.body.initials)],
        id_entity: dataObj.req.sanitize(dataObj.req.params.id)
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
            `UPDATE Entity SET designation=:designation,initials=:initials, desc_html_pt =:desc_html_pt, desc_html_eng =:desc_html_eng,slogan_eng=:slogan_eng,slogan_pt=:slogan_pt,
            colors=:colors,  main_email=:main_email,secondary_email=:secondary_email,main_contact=:main_contact , 
            main_contact=:main_contact,linkedIn=:linkedIn,facebook=:facebook,instagram=:instagram ,twitter=:twitter,youtube=:youtube,optional_course_menu=:optional_course_menu,
            optional_project_menu=:optional_project_menu,
            optional_recruitment_menu=:optional_recruitment_menu,
            optional_media_menu=:optional_media_menu
            Where Entity.id_entity=:id_entity`, {
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
                    linkedIn: (!dataObj.req.sanitize(dataObj.req.body.linkedIn)) ? null : dataObj.req.sanitize(dataObj.req.body.linkedIn),
                    facebook: (!dataObj.req.sanitize(dataObj.req.body.facebook)) ? null : dataObj.req.sanitize(dataObj.req.body.facebook),
                    instagram: (!dataObj.req.sanitize(dataObj.req.body.instagram)) ? null : dataObj.req.sanitize(dataObj.req.body.instagram),
                    youtube: (!dataObj.req.sanitize(dataObj.req.body.youtube)) ? null : dataObj.req.sanitize(dataObj.req.body.youtube),
                    twitter: (!dataObj.req.sanitize(dataObj.req.body.twitter)) ? null : dataObj.req.sanitize(dataObj.req.body.twitter),
                    // 
                    optional_course_menu: (dataObj.req.body.optional_course_menu == 0) ? 0 : 1,
                    optional_project_menu: (dataObj.req.body.optional_project_menu == 0) ? 0 : 1,
                    optional_recruitment_menu: (dataObj.req.body.optional_recruitment_menu == 0) ? 0 : 1,
                    optional_media_menu: (dataObj.req.body.optional_media_menu == 0) ? 0 : 1
                }
            }, {
                model: EntityModel.Entity
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





/**
 * Add Media  
 * StatusCompleted
 */
const addEntity = async (dataObj) => {
    console.log("Body: ");
    console.log(dataObj.req.body);

    console.log("colors");
    console.log(!dataObj.req.body.colors);


    console.log(!dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_eng) ||
        !dataObj.req.sanitize(dataObj.req.body.slogan_eng) || !dataObj.req.sanitize(dataObj.req.body.slogan_pt) || !dataObj.req.sanitize(dataObj.req.body.colors) || !dataObj.req.sanitize(dataObj.req.body.main_email) ||
        !dataObj.req.sanitize(dataObj.req.body.secondary_email) || !dataObj.req.sanitize(dataObj.req.body.main_contact));
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.initials) || !dataObj.req.sanitize(dataObj.req.body.desc_html_pt) || !dataObj.req.sanitize(dataObj.req.body.desc_html_eng) ||
        !dataObj.req.sanitize(dataObj.req.body.slogan_eng) || !dataObj.req.sanitize(dataObj.req.body.slogan_pt) || !dataObj.req.sanitize(dataObj.req.body.colors) || !dataObj.req.sanitize(dataObj.req.body.main_email) ||
        !dataObj.req.sanitize(dataObj.req.body.secondary_email) || !dataObj.req.sanitize(dataObj.req.body.main_contact)) {
        console.log("here fuck");
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

    let confirmUserExistentByParamsResult = await confirmUserExistentByParams({
        paramsValueArray: [dataObj.req.sanitize(dataObj.req.body.designation), dataObj.req.sanitize(dataObj.req.body.initials)],
        id_entity: null
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

    let dataStatusFetchResult = await (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
    if (dataStatusFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }



    let entityLevelFetchResult = await (await entityLevelController.fetchEntityLevelIdByDesignation("Secondary"))
    if (entityLevelFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }

    console.log("here titias");
    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/Logos/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }
    let generatedId = uniqueIdPack.generateRandomId('_Entity')
    // dataStatusFetchResult.toClient.processResult[0].id_status,
    let insertArray = [
        [generatedId, dataObj.req.sanitize(dataObj.req.body.designation), dataObj.req.sanitize(dataObj.req.body.initials), dataObj.req.sanitize(dataObj.req.body.desc_html_pt), dataObj.req.sanitize(dataObj.req.body.desc_html_eng), dataObj.req.sanitize(dataObj.req.body.slogan_eng),
            dataObj.req.sanitize(dataObj.req.body.slogan_pt),
            dataObj.req.sanitize(dataObj.req.body.colors),
            dataObj.req.sanitize(dataObj.req.body.main_email),
            dataObj.req.sanitize(dataObj.req.body.secondary_email),
            dataObj.req.sanitize(dataObj.req.body.main_contact),
            (!dataObj.req.sanitize(dataObj.req.body.linkedIn)) ? null : dataObj.req.sanitize(dataObj.req.body.linkedIn),
            (!dataObj.req.sanitize(dataObj.req.body.facebook)) ? null : dataObj.req.sanitize(dataObj.req.body.facebook),
            (!dataObj.req.sanitize(dataObj.req.body.instagram)) ? null : dataObj.req.sanitize(dataObj.req.body.instagram),
            (!dataObj.req.sanitize(dataObj.req.body.youtube)) ? null : dataObj.req.sanitize(dataObj.req.body.youtube),
            (!dataObj.req.sanitize(dataObj.req.body.twitter)) ? null : dataObj.req.sanitize(dataObj.req.body.twitter),
            0, 0, 0, 0,
            entityLevelFetchResult.toClient.processResult[0].id_entity_level, pictureUploadResult.toClient.processResult.generatedId, dataStatusFetchResult.toClient.processResult[0].id_status,

        ],
    ]
    await sequelize
        .query(
            `INSERT INTO Entity (id_entity,designation,initials,desc_html_pt,desc_html_eng,slogan_eng,slogan_pt,colors,main_email,secondary_email,main_contact,linkedIn,facebook,instagram,youtube,twitter,optional_course_menu,optional_project_menu,optional_recruitment_menu,optional_media_menu,id_entity_level,id_logo,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityModel.Entity
            }
        )
        .then(async data => {
            let menuControllerAddResult = await menuController.addDefaultMenus({
                idEntity: generatedId
            })

            if (menuControllerAddResult.processRespCode !== 201) {
                let deleteResponse = await deleteEntityOnFailCreation(generatedId)
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong please try again later",
                    }
                }
            } else {
                processResp = {
                    processRespCode: 201,
                    toClient: {
                        processResult: data,
                        processError: null,
                        processMsg: "All data Where created successfully.",
                    }
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
 *DELETE ENTITY ON cREATION FAILED 
 *Status :Completed
 */
const deleteEntityOnFailCreation = async (id_entity) => {
    let processResp = {}
    await sequelize
        .query(
            `DELETE FROM Entity Where Entity.id_entity=:id_entity `, {
                replacements: {
                    id_entity: id_entity
                }
            }, {
                model: EntityModel.Entity
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data Deleted Successfully",
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
 * Patch  Media status 
 * StatusCompleted
 */
const updateEntityStatus = async (dataObj) => {
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


    let fetchResult = await dataStatusController.fetchDataStatusIdByDesignation(dataObj.req.sanitize(dataObj.req.body.new_status))
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
            `UPDATE Entity SET Entity.id_status =:id_status  Where Entity.id_entity=:id_entity `, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_entity: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: EntityModel.Entity
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
 * patch Logo 
 * Status:Completed
 */
const updateEntityLogo = async (dataObj) => {
    let fetchResult = await fetchEntityLogo(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let uploadResult = await pictureController.updatePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/Logos/`
    })


    if (uploadResult.processRespCode !== 201) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `UPDATE Entity SET Entity.id_logo =:id_logo  Where Entity.id_entity=:id_entity `, {
                    replacements: {
                        id_logo: uploadResult.toClient.processResult.generatedId,
                        id_entity: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: EntityModel.Entity
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
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


}





/**
 * Delete 
 * Status:Completed
 */
const deleteEntity = async (dataObj) => {
    let fetchResult = await fetchEntityLogo(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let deleteResult = await pictureController.deletePictureInSystemById({
        req: dataObj.req,
        id_picture: fetchResult.toClient.processResult,
        folder: `/Images/Logos/`
    })


    if (deleteResult.processRespCode !== 200) {
        return uploadResult
    } else {
        await sequelize
            .query(
                `DELETE FROM Entity Where Entity.id_entity=:id_entity `, {
                    replacements: {
                        id_entity: dataObj.req.sanitize(dataObj.req.params.id)
                    }
                }, {
                    model: EntityModel.Entity
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
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


}




/**
 * Confirms if params has been taken Assist the login , Register back up 
 * Status :Completed 
 * @param {Obj} dataObj Contains Multiple data
 * @returns 
 */
const confirmUserExistentByParams = async (dataObj) => {

    let processResp = {}
    let arrayOfColumn = ['designation', 'initials']
    let responses = ['The designation is already associated with another entity.', 'The initials are already associated with another entity.']
    for (let i = 0; i < 2; i++) {
        let confirmExistenceResponse = await confirmParamsValueTaken({
            selectedField: arrayOfColumn[i],
            substitute: dataObj.paramsValueArray[i],
            id_entity: dataObj.id_entity,
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

    let query = (dataObj.id_entity === null) ? `SELECT id_entity FROM Entity where ${dataObj.selectedField} =:substitute` : `SELECT id_entity FROM Entity where ${dataObj.selectedField} =:substitute and Entity.id_entity !=:id_entity`

    await sequelize
        .query(query, {
            replacements: {
                substitute: dataObj.substitute,
                id_entity: dataObj.id_entity
            }

        }, {
            model: EntityModel.Entity
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
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchEntityLogo = async (id_entity) => {
    let processResp = {}
    await sequelize
        .query(`select id_logo From Entity where Entity.id_entity =:id_entity;`, {
            replacements: {
                id_entity: id_entity
            }
        }, {
            model: EntityModel.Entity
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
                    processResult: ((!data[0][0].id_logo) ? null : data[0][0].id_logo),
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
    fetchMainEntityId,
    initEntity,
    // fetchEntityIdByName,
    fetchFullEntityDataById,
    fetchEntityIdByDesignation,
    fetchEntityIdByInitials,
    //
    fetchAllEntitiesInitials,
    addEntity,
    // 
    fetchEntitiesByAdmin,
    updateEntityStatus,
    editEntity,
    deleteEntity,
    updateEntityLogo,
    fetchAllSecondaryEntities
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