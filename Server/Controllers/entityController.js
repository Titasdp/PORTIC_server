const EntityModel = require("../Models/Entity")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
const dataStatusController = require("../Controllers/dataStatusController")



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
 * Function that fetch all entity from the Database
 * Done
 * Admin Only
 */
fetchEntityDataById = (receivedObj, callback) => {
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
 * Function that adds the default entity (PORTIC) to the system 
 * TODO
 */
initEntity = async (dataObj, callback) => {
    if (dataObj.data_status_id === null || dataObj.entity_level_id === null) {
        console.log(error);
        let processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: error,
                processMsg: "Something went wrong please try again later",
            }
        }
        return callback(false, processResp)
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Entity'), `Porto Research, Technology
        & Innovation Center`, `PORTIC`, `<p><span wfd-id="217">O PORTIC -Porto Research, Technology &amp; Innovation Center </span>visa agregar vários centros e grupos de investigação das escolas do P.PORTO num único espaço físico, configurando uma superestrutura dedicada à investigação, transferência de tecnologia, inovação e empreendedorismo. Alojará ainda a Porto Global Hub que integra a Porto Design Factory, a Porto Business Innovation e a Startup Porto e que tem como visão ajudar a criação de projetos locais sustentáveis para uma vida melhor.</p>`, `<p> <span wfd-id = "217"> THE PORTIC -Porto Research, Technology & amp; Innovation Center </span> aims to bring together several research centers and groups from the schools of P.PORTO in a single physical space, configuring a superstructure dedicated to research, technology transfer, innovation and entrepreneurship. It will also host the Porto Global Hub that integrates Porto Design Factory, Porto Business Innovation and Startup Porto and that aims to help create sustainable local projects for a better life. </p>`, `An open door towards the future`, `Uma porta aberta para o futuro`, dataObj.id_entity_level, dataObj.id_logo, data.dataObj.id_status],
    ]
    sequelize
        .query(
            `INSERT INTO Entity (id_entity,designation,initials) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: DataStatusModel.Data_status
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
            return callback(false, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
}


module.exports = {
    initEntity

}