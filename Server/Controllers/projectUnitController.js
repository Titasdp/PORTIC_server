//MainModel
const ProjectUnityModel = require("../Models/ProjectUnity")

//Database Connection 
const sequelize = require("../Database/connection")



const createConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id_project) || !dataObj.req.sanitize(dataObj.req.params.id_unity)) {
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




    let fetchResult = await confirmConnection(dataObj.req.sanitize(dataObj.req.params.id_project), dataObj.req.sanitize(dataObj.req.params.id_unity))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    } else if (fetchResult.processRespCode === 200) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Cannot complete the process,because the connection already exists.",
            }
        }
        return processResp
    }

    await sequelize
        .query(
            `INSERT INTO Project_unity(id_project,id_unity) VALUES (:id_project,:id_unity);`, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id_unity)
                },
            }, {
                model: ProjectUnityModel.Project_unity
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
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}


const unlinkConnection = async (dataObj) => {

    let query = `DELETE FROM Project_unity Where Project_unity.id_project =:id_project and Project_unity.id_unity =:id_unity;`

    await sequelize
        .query(
            query, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id_unity)
                }
            },
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data Deleted Successfully",
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
 * Fetches Connection 
 * Status: Complete
 */
const confirmConnection = async (id_project, id_unity) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Project_unity Where id_project =:id_project and id_unity = :id_unity;`, {
            replacements: {
                id_project: id_project,
                id_unity: id_unity,
            }
        }, {
            model: ProjectUnityModel.Project_unity
        })
        .then(data => {

            let respCode = 200;
            let respMsg = "Fetched successfully."
            console.log();
            if (data[0].length === 0) {
                console.log("here");
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
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
};





module.exports = {
    unlinkConnection,
    createConnection

}