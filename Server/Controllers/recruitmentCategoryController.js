const RecruitmentCategoryModel = require("../Models/RecruitmentCategory")
const sequelize = require("../Database/connection");
const {
    query
} = require("express");

/**
 * add Recruitment Category on init
 *Status: Completed
 */
const initAddRecruitmentCategory = async (dataObj) => {
    let processResp = {}
    if (dataObj.exist) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The recruitment already has that category associated",
            }
        }
        processResp
    }

    await sequelize
        .query(
            `INSERT INTO Recruitment_category (id_available_position, id_category) VALUES ${dataObj.insertArray.map(element => '(?)').join(',')};`, {
                replacements: dataObj.insertArray
            }, {
                model: RecruitmentCategoryModel.Recruitment_category
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new category was successfully created.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp
};

/**
 * Confirms if a specific connection has already been established 
 *Status: Confirmed
 */
const confirmExistenceByParams = async (dataObj) => {
    let processResp = {}
    let query = `select id_available_position From Recruitment_category Where id_available_position =:id_available_position  and id_category =:id_category`
    await sequelize
        .query(query, {
            replacements: {
                id_available_position: dataObj.req.sanitize(dataObj.req.params.id),
                id_category: dataObj.req.sanitize(dataObj.req.body.id_category)
            }
        }, {
            model: UserModel.User
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
                    processResult: null,
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
}



/**
 * Connect an position to an category 
 *Status: Confirmed
 */
const establishConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.params.id || !dataObj.req.body.id_category) {
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
    let fetchResult = await confirmExistenceByParams(dataObj)
    if (fetchResult.processRespCode === 200) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, please try again later.",
            }
        }
        return processResp
    } else if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let insertArray = [
        [dataObj.req.sanitize(dataObj.req.params.id), dataObj.req.sanitize(dataObj.req.body.id_category)],
    ]

    await sequelize
        .query(
            `INSERT INTO Recruitment_category (id_available_position, id_category) VALUES ${dataObj.insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: RecruitmentCategoryModel.Recruitment_category
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new connection has been established.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp
}




/**
 * Demolish a connection between an position to an category 
 *Status: Confirmed
 */
const demolishConnection = async (dataObj) => {
    await sequelize
        .query(
            `DELETE FROM Recruitment_category Where id_available_position=:id_available_position ad id_category =:id_category;`, {
                replacements: {
                    id_available_position: dataObj.req.params.id,
                    id_category: dataObj.body.id_available_position
                }
            }, {
                model: RecruitmentCategoryModel.Recruitment_category
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new category was successfully created.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp
}

















module.exports = {
    initAddRecruitmentCategory,
    establishConnection

}