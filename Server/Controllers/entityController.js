const EntityModel = require("../Models/Entity")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");
const {
    query
} = require("express");



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