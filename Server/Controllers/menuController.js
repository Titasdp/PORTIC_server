const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const MenuModel = require("../Models/Menu")



const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_menu FROM Menu", {
            model: MenuModel.Menu
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


const initMenu = async (dataObj) => {
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



    if (dataObj.idDataStatus === null || dataObj.idEntity === null) {

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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Menu'), "Contacts", "Sobre Nós", null, null, `Contacts`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Units", "Unidades", `PORTIC integrates several research, development and innovation units, either internal or making space available for external units and entities.`, `O PORTIC integra diversas unidades de investigação, desenvolvimento e inovação, seja internas, seja disponibilizando espaço para unidades e entidades externas.`, `Unities`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Courses", "Cursos", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Courses`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Projects", "Projetos", null, null, `ProjectsCatalog`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Media", "Media", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Media`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Positions", "Recrutamento", `nothing`, `nada`, `Positions`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Login", "Login", null, null, `SignIn`, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Entidades", "Entities", null, null, `Entities`, dataObj.idDataStatus, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Menu (id_menu,designation_eng,designation_pt,page_description_eng,page_description_pt,router_link,id_status,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: MenuModel.Menu
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


const addDefaultMenus = async (dataObj) => {
    let processResp = {}

    if (dataObj.idEntity === null) {
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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Menu'), "Contacts", "Sobre Nós", null, null, `Contacts`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Units", "Unidades", `PORTIC integrates several research, development and innovation units, either internal or making space available for external units and entities.`, `O PORTIC integra diversas unidades de investigação, desenvolvimento e inovação, seja internas, seja disponibilizando espaço para unidades e entidades externas.`, `Unities`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Courses", "Cursos", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Courses`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Projects", "Projetos", null, null, `ProjectsCatalog`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Media", "Media", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Media`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Positions", "Recrutamento", `nothing`, `nada`, `Positions`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Login", "Login", null, null, `SignIn`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Entidades", "Entities", null, null, `Entities`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Menu (id_menu,designation_eng,designation_pt,page_description_eng,page_description_pt,router_link,id_status,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: MenuModel.Menu
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
 * Fetches all Menus from a specific entity
 * Status: Completed
 */
const fetchEntityMenus = async (dataObj) => {
    let processResp = {}
    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? ` SELECT Menu.id_menu ,Menu.designation_pt as menu_designation,Menu.default, Menu.external_path,  Menu.info_html_pt as info_html , Menu.page_description_pt as page_description, Menu.router_link FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity;` : `SELECT Menu.id_menu ,Menu.designation_eng as menu_designation,Menu.default, Menu.external_path, Menu.info_html_eng as info_html ,Menu.page_description_eng as page_description, Menu.router_link FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: MenuModel.Menu
        })
        .then(data => {
            let menusArray = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
                processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: respMsg,
                    }
                }
                return processResp
            } else {
                for (const el of data[0]) {
                    let obj = {
                        id_menu: el.id_menu,
                        menu_designation: el.menu_designation,
                        default: el.default,
                        external_path: el.external_path,
                        spotlight_1: el.spotlight_1,
                        spotlight_2: el.spotlight_2,
                        info_html: el.info_html,
                        page_description: el.page_description,
                        router_link: el.router_link,
                        submenus_array: []
                    }
                    menusArray.push(obj);
                }
                processResp = {
                    processRespCode: respCode,
                    toClient: {
                        processResult: menusArray,
                        processError: null,
                        processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};


module.exports = {
    initMenu,
    fetchEntityMenus,
    addDefaultMenus
}