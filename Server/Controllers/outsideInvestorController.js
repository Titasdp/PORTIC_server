//main model
const OutsideInvestorModel = require("../Models/OutsideInvestor")


//Controllers 
const pictureController = require("../Controllers/pictureController")


//Database Connection 
const sequelize = require("../Database/connection")
//Middleware 
const uniqueIdPack = require("../Middleware/uniqueId")






const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_investor FROM Outside_investor", {
            model: OutsideInvestorModel.Outside_investor
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
const initOutsideInvestors = async (dataObj) => {
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
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `ISEP`, dataObj.idCreator, dataObj.project1id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, dataObj.project1id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, dataObj.project1id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, dataObj.project1id],
        // 
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `EFACEC`, dataObj.idCreator, dataObj.project2id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `PFP`, dataObj.idCreator, dataObj.project2id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `Evoleo`, dataObj.idCreator, dataObj.project2id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IP`, dataObj.idCreator, dataObj.project2id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `NomadTech`, dataObj.idCreator, dataObj.project2id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `AlmaDesign`, dataObj.idCreator, dataObj.project2id],
        //
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, dataObj.project3id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, dataObj.project3id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, dataObj.project3id],
        // 
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, dataObj.project4id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, dataObj.project4id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, dataObj.project4id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `ISEP`, dataObj.idCreator, dataObj.project4id],
        //
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, dataObj.project5id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, dataObj.project5id],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, dataObj.project5id],
    ]
    await sequelize
        .query(
            `INSERT INTO Outside_investor (id_investor,designation,id_publisher,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: OutsideInvestorModel.Outside_investor
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
    console.log(processResp);
    return processResp
}



const fetchProjectOutsideInvestor = async (id_project) => {
    let processResp = {}
    let query = `Select id_investor, designation,page_url from Outside_investor Where Outside_investor.id_project = :id_project`;

    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: OutsideInvestorModel.Outside_investor
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
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
const addProjectOutsideInvestor = async (dataObj) => {
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


    let pictureUploadResult = null
    if (dataObj.req.files || Object.keys(dataObj.req.files).length !== 0) {
        pictureUploadResult = await pictureController.addPictureOnCreate({
            folder: `/Images/Logos/`,
            req: dataObj.req
        })
        if (pictureUploadResult.processRespCode !== 201) {
            return pictureUploadResult
        }
    }


    let insertArray = [
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), dataObj.req.sanitize(dataObj.req.body.investor_name), pictureUploadResult.toClient.processResult.generatedId, dataObj.idUser, dataObj.req.sanitize(dataObj.req.params.id)],
    ]
    await sequelize
        .query(
            `INSERT INTO Outside_investor (id_investor,designation,id_logo,id_publisher,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: OutsideInvestorModel.Outside_investor
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
const deleteProjectInvestor = async (dataObj) => {
    let fetchResult = await fetchOutsideInvestorLogo(dataObj.req.sanitize(dataObj.req.params.id_outside_investor))

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
const fetchOutsideInvestorLogo = async (id_investor) => {
    let processResp = {}
    await sequelize
        .query(`select id_logo from Outside_investor where Outside_investor.id_investor =:id_investor;`, {
            replacements: {
                id_investor: id_investor
            }
        }, {
            model: OutsideInvestorModel.Outside_investor
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
    initOutsideInvestors,
    fetchProjectOutsideInvestor,

    // Admin ,
    addProjectOutsideInvestor,
    deleteProjectInvestor,
}