//main model
const ExternalCollaboratorModel = require("../Models/ExternalCollaborators")


//Controllers 
const pictureController = require("../Controllers/pictureController")


//Database Connection 
const sequelize = require("../Database/connection")
//Middleware 
const uniqueIdPack = require("../Middleware/uniqueId")

// Env
require("dotenv").config();





const fetchProjectExternalCollaborator = async (id_project) => {
    let processResp = {}
    let query = `Select External_collaborator.id_collaborator, External_collaborator.full_name, External_collaborator.id_picture From External_collaborator Where External_collaborator.id_project =:id_project;`;
    await sequelize
        .query(query, {
            replacements: {
                id_project: id_project
            }
        }, {
            model: ExternalCollaboratorModel.External_collaborator
        })
        .then(async data => {
            let collaborators = []
            let respCode = 200
            let respMsg = "Fetch successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            for (const el of data[0]) {
                let object = {
                    id_collaborator: el.id_collaborator,
                    full_name: el.full_name,
                    picture: null
                }
                if (el.id_logo !== null) {
                    let fetchImgResult = await pictureController.fetchPictureInSystemById(el.id_picture);

                    object.picture = process.env.API_URL + fetchImgResult.toClient.processResult
                }
                collaborators.push(object)
            }

            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: collaborators,
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
const addProjectCollaborator = async (dataObj) => {
    if (!dataObj.idUser || !dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.full_name)) {

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



    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/FacePicture/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_ExternalCollaborator'), dataObj.req.sanitize(dataObj.req.body.full_name), pictureUploadResult.toClient.processResult.generatedId, dataObj.req.sanitize(dataObj.req.params.id)],
    ]
    await sequelize
        .query(
            `INSERT INTO External_collaborator (id_collaborator,full_name,id_picture,id_project) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: ExternalCollaboratorModel.External_collaborator
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
const deleteProjectCollaborator = async (dataObj) => {
    let fetchResult = await fetchCollaboratorPicture(dataObj.req.sanitize(dataObj.req.params.id_collaborator))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }
    let deleteResult = {}
    if (fetchResult.toClient.processResult) {
        deleteResult = await pictureController.deletePictureInSystemById({
            req: dataObj.req,
            id_picture: fetchResult.toClient.processResult,
            folder: `/Images/FacePicture/`
        })

        if (deleteResult.processRespCode !== 200) {
            return deleteResult
        }
    }

    await sequelize
        .query(
            `DELETE FROM External_collaborator Where External_collaborator.id_collaborator=:id_collaborator and External_collaborator.id_project =:id_project;`, {
                replacements: {
                    id_collaborator: dataObj.req.sanitize(dataObj.req.params.id_collaborator),
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                },
            }, {
                model: ExternalCollaboratorModel.External_collaborator
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data deleted successfully",
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
const fetchCollaboratorPicture = async (id_collaborator) => {
    let processResp = {}
    await sequelize
        .query(`select id_picture from External_collaborator where External_collaborator.id_collaborator =:id_collaborator;`, {
            replacements: {
                id_collaborator: id_collaborator
            }
        }, {
            model: ExternalCollaboratorModel.External_collaborator
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
                    processResult: ((!data[0][0].id_picture) ? null : data[0][0].id_picture),
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
    fetchProjectExternalCollaborator,

    // Admin ,
    addProjectCollaborator,
    deleteProjectCollaborator,
}