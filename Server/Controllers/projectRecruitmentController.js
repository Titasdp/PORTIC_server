//MainModel
const ProjectRecruitmentModel = require("../Models/ProjectRecruitment")

//Database Connection 
const sequelize = require("../Database/connection")



const createConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id_project) || !dataObj.req.sanitize(dataObj.req.params.id_available_position)) {
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



    let fetchResult = await confirmConnection(dataObj.req.sanitize(dataObj.req.params.id_project), dataObj.req.sanitize(dataObj.req.params.id_available_position))

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
            `INSERT INTO Project_recruitment(id_project,id_available_position) VALUES (:id_project,:id_available_position);`, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id_available_position)
                },
            }, {
                model: ProjectRecruitmentModel.Project_recruitment
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
    let query = `DELETE FROM Project_recruitment Where Project_recruitment.id_project =:id_project and Project_recruitment.id_available_position =:id_available_position;`

    await sequelize
        .query(
            query, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id_available_position)
                }
            }, {
                model: ProjectRecruitmentModel.Project_recruitment
            }
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
const confirmConnection = async (id_project, id_available_position) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Project_recruitment Where id_project =:id_project and id_available_position = :id_available_position;`, {
            replacements: {
                id_project: id_project,
                id_available_position: id_available_position,
            }
        }, {
            model: ProjectRecruitmentModel.Project_recruitment
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