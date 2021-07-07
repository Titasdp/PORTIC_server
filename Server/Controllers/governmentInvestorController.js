//main model
const GovernmentInvestorModel = require("../Models/GovernmentInvestor")


//Controllers 
const pictureController = require("./pictureController")


//Database Connection 
const sequelize = require("../Database/connection")
//Middleware 
const uniqueIdPack = require("../Middleware/uniqueId");
const {
    Outside_investor
} = require("../Models/OutsideInvestor");

// Env
require("dotenv").config();



const fetchProjectGovInvestor = async (id_project) => {
    let processResp = {}
    let query = `Select Government_investor.id_investor, Government_investor.id_logo from Government_investor Where Government_investor.id_project =:id_project;`;

    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: GovernmentInvestorModel.Government_investor
        })
        .then(async data => {
            let investors = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }


            for (const el of data[0]) {

                let object = {
                    id_investor: el.id_investor,
                    designation: el.designation,
                    logo: null
                }
                if (el.id_logo !== null) {
                    let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_logo);

                    object.logo = process.env.API_URL + fetchImgResult.toClient.processResult
                }

                investors.push(object)

            }

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: investors,
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
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp
}




/**
 * Add Investor to the investor table
 * Status:Completed
 */
const addProjectGovInvestor = async (dataObj) => {
    if (!dataObj.idUser || !dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.investor_name)) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request.",
            }
        }
        return processResp
    }
    if (condition) {

    }


    let pictureUploadResult = null

    pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/Logos/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }


    let insertArray = [
        [uniqueIdPack.generateRandomId('_GovInvestor'), (!pictureUploadResult) ? null : (pictureUploadResult.toClient.processResult.generatedId), dataObj.req.sanitize(dataObj.req.params.id)],
    ]
    await sequelize
        .query(
            `INSERT INTO Government_investor (id_investor,id_logo,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: GovernmentInvestorModel.Government_investor
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




/**
 * Add Investor to the investor table
 * Status:Completed
 */
const deleteProjectGovInvestor = async (dataObj) => {
    let fetchResult = await fetchGovInvestorLogo(dataObj.req.sanitize(dataObj.req.params.id_investor))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let deleteResult = {}
    if (fetchResult.toClient.processResult) {
        deleteResult = await pictureController.deletePictureInSystemById({
            req: dataObj.req,
            id_picture: fetchResult.toClient.processResult,
            folder: `/Images/Logos/`
        })

        if (deleteResult.processRespCode !== 200) {
            return deleteResult
        }
    }

    await sequelize
        .query(
            `DELETE FROM Outside_investor Where Outside_investor.id_investor=:id_investor and Outside_investor.id_project =:id_project;`, {
                replacements: {
                    id_investor: dataObj.req.sanitize(dataObj.req.params.id_outside_investor),
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                },
                dialectOptions: {
                    multipleStatements: true
                }
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Investor deleted successfully",
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






//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchGovInvestorLogo = async (id_investor) => {
    let processResp = {}
    await sequelize
        .query(`select id_logo from Government_investor where Government_investor.id_investor =:id_investor;`, {
            replacements: {
                id_investor: id_investor
            }
        }, {
            model: GovernmentInvestorModel.Government_investor
        })
        .then(data => {
            console.log(data);
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: ((!data[0][0].id_logo) ? null : data[0][0].id_logo),
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
    fetchProjectGovInvestor,
    addProjectGovInvestor,
    deleteProjectGovInvestor,
}