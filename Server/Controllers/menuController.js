const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const MenuModel = require("../Models/Menu")

//Controllers 
const dataStatusController = require("../Controllers/dataStatusController")



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
    console.log("menus add:");
    console.log(dataObj);

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
    console.log(dataStatusFetchResult);

    if (dataStatusFetchResult.processRespCode === 500) {
        console.log("failing here");
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
        [uniqueIdPack.generateRandomId('_Menu'), "Courses", "Cursos", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Courses`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Projects", "Projetos", null, null, `ProjectsCatalog`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Media", "Media", `Research and development, technology and knowledge transfer, innovation and creativity, entrepreneurship, incubation, spin-offs, startups – these are all part of Research, Technology & Innovation, a holistic chain of interrelated activities. PORTIC includes units and groups with activities in different stages of the knowledge and innovation chain, in several areas of knowledge.`, `Investigação e desenvolvimento, transferência de tecnologia e conhecimento, inovação e criatividade, empreendedorismo, incubação, spin-offs, start-ups - tudo isto faz parte da Investigação, Tecnologia & Inovação, uma cadeia holística de actividades inter-relacionadas. PORTIC inclui unidades e grupos com actividades em diferentes fases da cadeia do conhecimento e da inovação, em várias áreas do conhecimento.`, `Media`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Positions", "Recrutamento", `nothing`, `nada`, `Positions`, dataStatusFetchResult.toClient.processResult[0].id_status, dataObj.idEntity],
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
            console.log("sucess here");

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
    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? ` SELECT Menu.id_menu ,Menu.designation_pt as menu_designation,Menu.default, Menu.external_path,  Menu.info_html_pt as info_html , Menu.page_description_pt as page_description, Menu.router_link FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity and Menu.router_link not In ${dataObj.notIn};` : `SELECT Menu.id_menu ,Menu.designation_eng as menu_designation,Menu.default, Menu.external_path, Menu.info_html_eng as info_html ,Menu.page_description_eng as page_description, Menu.router_link FROM ( Menu INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity and  Menu.router_link not In ${dataObj.notIn};`
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

/**
 * Fetches all Menus from a specific entity for the admin
 * Status: Completed
 */
const fetchEntityMenusByAdmin = async (id_entity) => {
    let processResp = {}
    let query = `SELECT Menu.id_menu ,Menu.designation_pt,Menu.designation_eng,Menu.default, Menu.external_path,  Menu.info_html_pt,Menu.info_html_eng , Menu.page_description_pt, Menu.page_description_eng, Menu.router_link FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Menu.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: id_entity
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
                        designation_pt: el.designation_pt,
                        designation_eng: el.designation_eng,
                        default: el.default,
                        info_html_pt: el.info_html_pt,
                        info_html_pt: el.info_html_pt,
                        page_description_pt: el.page_description_pt,
                        page_description_eng: el.page_description_eng,

                        router_link: el.router_link,
                        can_be_deleted: (el.default != 0) ? true : false
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


/**
 * Edit entity menu
 * Status: Completed 
 */


const editEntityMenu = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.designation_pt) || !dataObj.req.sanitize(dataObj.req.body.designation_eng) || !dataObj.req.sanitize(dataObj.req.body.page_description_eng) || !dataObj.req.sanitize(dataObj.req.body.page_description_pt)) {
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


    await sequelize
        .query(
            `UPDATE Menu SET designation_eng=:designation_eng,designation_pt=:designation_pt,page_description_eng :=page_description_eng,page_description_pt:=page_description_pt  Where Menu.id_menu=:id_menu`, {
                replacements: {
                    id_menu: dataObj.req.sanitize(dataObj.req.params.id_menu),
                    designation_pt: dataObj.req.sanitize(dataObj.req.body.designation_pt),
                    designation_eng: dataObj.req.sanitize(dataObj.req.body.designation_eng),
                    page_description_eng: dataObj.req.sanitize(dataObj.req.body.page_description_eng),
                    page_description_pt: dataObj.req.sanitize(dataObj.req.body.page_description_pt),
                }
            }, {
                model: MenuModel.Menu
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The media was updated successfully",
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
    initMenu,
    fetchEntityMenus,
    addDefaultMenus,
    fetchEntityMenusByAdmin,
    editEntityMenu
}