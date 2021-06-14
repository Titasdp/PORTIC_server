//main model
const OutsideInvestorModel = require("../Models/OutsideInvestor")
//middleware
const uniqueIdPack = require("../Middleware/uniqueId")
const ProjectController = require("../Controllers/projectController")



/**
 * Initialize the table Project by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initOutsideInvestors = async (dataObj) => {
    let processResp = {}
    if (dataObj.idCreator === null) {

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
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `ISEP`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("CybersSeCIP")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("CybersSeCIP")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("CybersSeCIP")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("CybersSeCIP")],
        // 
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `EFACEC`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("FERROVIA 4.0")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `PFP`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("FERROVIA 4.0")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `Evoleo`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("FERROVIA 4.0")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IP`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("CFERROVIA 4.0")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `NomadTech`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("FERROVIA 4.0")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `AlmaDesign`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("FERROVIA 4.0")],
        //
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("GreenHealth")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("GreenHealth")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("GreenHealth")],
        // 
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("SmartHealth")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("SmartHealth")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("SmartHealth")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `ISEP`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("SmartHealth")],
        //
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPVC`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("TECH")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPB`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("TECH")],
        [uniqueIdPack.generateRandomId('_OutsideInvestor'), `IPCA`, dataObj.idCreator, await ProjectController.fetchProjectByIdByInitials("TECH")],
    ]
    await sequelize
        .query(
            `INSERT INTO Project (id_investor,designation,id_publisher,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
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
            return processResp
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processSuccess: null,
                    processError: null,
                    processMsg: "Something went wrong while trying to init outsideInvestor.",
                }
            }
            return processResp
        });
}

module.exports = {
    initOutsideInvestors
}