//main model
const InsideInvestorModel = require("../Models/ProjectInsideInvestor")

//Database Connection 
const sequelize = require("../Database/connection")



const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_project FROM Project_inside_investor", {
            model: InsideInvestorModel.Project_inside_investor
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
 * Initialize the table Project by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initInsideInvestors = async (dataObj) => {
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
    if (dataObj.idCreator === null || dataObj.project1id === null || dataObj.project2id === null || dataObj.project3id === null || dataObj.project4id === null || dataObj.project5id === null) {

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

    let insertArray = [
        [dataObj.idEntity, dataObj.project1id],
        [dataObj.idEntity, dataObj.project2id],
        [dataObj.idEntity, dataObj.project3id],
        [dataObj.idEntity, dataObj.project4id],
        [dataObj.idEntity, dataObj.project5id],
    ]
    await sequelize
        .query(
            `INSERT INTO Project_inside_investor (id_entity,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: InsideInvestorModel.Project_inside_investor
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
                    processSuccess: null,
                    processError: null,
                    processMsg: "Something went wrong while trying to init outsideInvestor.",
                }
            }

        });

    return processResp
}

module.exports = {
    initInsideInvestors
}