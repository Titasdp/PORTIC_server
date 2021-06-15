const UserTitleModel = require("../Models/UserTitle")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * gets userTitle ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_title FROM User_title", {
            model: UserTitleModel.User_title
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
 * inits the user userTitle by adding predefine data
 * @returns (data obj with multiple params )
 */
const initUserTitle = async () => {
    let processResp = {};
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


    let insertArray = [
        [uniqueIdPack.generateRandomId('_UserTitle'), 'Indefinido', 'Not Defined']
    ]
    await sequelize
        .query(
            `INSERT INTO User_title (id_title,designation_pt,designation_eng) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UserTitleModel.User_title
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created",
                }
            }
        })
        .catch(error => {
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
};


const fetchTitleIdByDesignationInit = async (designation) => {
    let processResp = {}
    let query = `SELECT id_title FROM User_title where designation_pt = :designation`;

    await sequelize
        .query(query, {
            replacements: {
                designation: designation,
            }
        }, {
            model: UserTitleModel.User_title
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







module.exports = {
    initUserTitle,
    fetchTitleIdByDesignationInit
}