const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const MenuModel = require("../Models/Menu")
//!Working here
/**
 * Initialize the table Menu by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initMenu = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idDataStatus === null || dataObj.idEntity === null) {

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
        [uniqueIdPack.generateRandomId('_Menu'), "Contacts", "Contatos", null, null, null, null, null, null, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Unities", "Unities", `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Nada</h3> <p>Nada</p>`, `<h3>Nada</h3> <p>Nada</p>`, "Nothing", "Nada", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Areas", "Areas", `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Nada</h3> <p>Nada</p>`, `<h3>Nada</h3> <p>Nada</p>`, "Nothing", "Nada", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Courses", "Cursos", `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Nada</h3> <p>Nada</p>`, `<h3>Nada</h3> <p>Nada</p>`, "Nothing", "Nada", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Projects", "Projeto", null, null, null, null, null, null, dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Media", "Media", `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Nada</h3> <p>Nada</p>`, `<h3>Nada</h3> <p>Nada</p>`, "Nothing", "Nada", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Careers", "Recrutamento", `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Nada</h3> <p>Nada</p>`, `<h3>Nada</h3> <p>Nada</p>`, "Nothing", "Nada", dataObj.idDataStatus, dataObj.idEntity],
    ]
    sequelize
        .query(
            `INSERT INTO Menu (id_menu,designation_eng,designation_pt,spotlight_1_eng ,spotlight_2_eng,spotlight_1_pt,spotlight_2_pt,page_description_eng,page_description_pt,id_status,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
 * Fetches all Menus 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchMenus = (req, callback) => {
    sequelize
        .query("SELECT * FROM Menu", {
            model: MenuModel.Menu
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




/**
 * Fetches all Menus from a specific entity
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchEntityMenus = (dataObj, callback) => {
    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? ` SELECT Menu.id_menu ,Menu.designation_pt as menu_designation,Menu.default, Menu.external_path, Menu.spotlight_1_pt as spotlight_1, Menu.spotlight_2_pt as spotlight_2, Menu.info_html_pt as info_html , Menu.page_description_pt as page_description FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity;` : `SELECT Menu.id_menu ,Menu.designation_eng as menu_designation,Menu.default, Menu.external_path, Menu.spotlight_1_eng as spotlight_1, Menu.spotlight_2_eng as spotlight_2, Menu.info_html_eng as info_html ,  Menu.page_description_eng as page_description FROM ( Menu  INNER JOIN Data_Status on Data_Status.id_status = Menu.id_status) where Data_Status.designation = "Published" and Menu.id_entity =:id_entity;`
    sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: MenuModel.Menu
        })
        .then(data => {
            let menusArray = []
            let success = 0
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
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
                        submenus_array: []
                    }
                    menusArray.push(obj);
                    success++;
                }

                if (success === data[0].length) {
                    success = 0
                    let processResp = {
                        processRespCode: respCode,
                        toClient: {
                            processResult: menusArray,
                            processError: null,
                            processMsg: respMsg,
                        }
                    }
                    return callback(true, processResp)
                }
            }
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
    initMenu,
    fetchMenus,
    fetchEntityMenus
}