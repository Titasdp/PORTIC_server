const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")
const MenuModel = require("../Models/Menu")

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
        [uniqueIdPack.generateRandomId('_Menu'), "Contacts", "Contatos", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Unities", "Unities", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Areas", "Areas", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Courses", "Cursos", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Projects", "Projeto", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Media", "Media", dataObj.idDataStatus, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_Menu'), "Careers", "Recrutamento", dataObj.idDataStatus, dataObj.idEntity],
    ]
    sequelize
        .query(
            `INSERT INTO Menu (id_menu,designation_eng,designation_pt,id_status,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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






















module.exports = {
    initMenu,
    fetchMenus
}