const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const PageModel = require("../Models/Page")
//!Working here
/**
 * Initialize the table Page by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initPage = async (dataObj, callback) => {
    console.log(dataObj.idUser);
    let processResp = {}
    if (dataObj.idDataStatus === null || dataObj.idEntity === null || dataObj.menusIds.length !== 7 || dataObj.idUser === null) {

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
        [uniqueIdPack.generateRandomId('_PageInfo'), "Contacts", "Contatos", 1, null, null, dataObj.idEntity, dataObj.menusIds[0].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Unities", "Unities", 1, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, dataObj.idEntity, dataObj.menusIds[1].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Areas", "Areas", 1, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, dataObj.idEntity, dataObj.menusIds[2].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Courses", "Cursos", 1, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, dataObj.idEntity, dataObj.menusIds[3].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Projects", "Projeto", 1, null, null, dataObj.idEntity, dataObj.menusIds[4].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Media", "Media", 1, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, dataObj.idEntity, dataObj.menusIds[5].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_PageInfo'), "Careers", "Recrutamento", 1, `<h3>Noting</h3> <p>Nothing</p>`, `<h3>Noting</h3> <p>Nothing</p>`, dataObj.idEntity, dataObj.menusIds[6].id_menu, dataObj.idUser, null, dataObj.idDataStatus],
    ]
    sequelize
        .query(
            `INSERT INTO Page (id_page , designation_eng , designation_pt , default_page , spotlight_1 , spotlight_2 , id_entity, id_menu, id_creator, page_description , id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: PageModel.Page
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
 * Fetches all Pages 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchPages = (req, callback) => {
    sequelize
        .query("SELECT * FROM Page", {
            model: PageModel.Page
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
 * Fetches all Pages from an entity
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchMenuPage = (dataObj, callback) => {
    sequelize
        .query("SELECT * FROM Page where is page", {
            model: PageModel.Page
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
    initPage,
    fetchPages
}