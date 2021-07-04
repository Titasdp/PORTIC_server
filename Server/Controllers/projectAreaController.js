//MainModel
const ProjectAreaModel = require("../Models/ProjectArea")

//Database Connection 
const sequelize = require("../Database/connection")



const createConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id_project) || !dataObj.req.sanitize(dataObj.req.params.id_area)) {
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

    let fetchResult = await confirmConnection(dataObj.req.sanitize(dataObj.req.params.id_project), dataObj.req.sanitize(dataObj.req.params.id_area))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    } else if (fetchResult.processRespCode === 200) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The project and the area are already connected.",
            }
        }
        return processResp
    }

    await sequelize
        .query(
            `INSERT INTO Project_area(id_project,id_area) VALUES (:id_project,:id_area);`, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_area: dataObj.req.sanitize(dataObj.req.params.id_area)
                },
            }, {
                model: ProjectAreaModel.Project_area
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

    let query = `DELETE  FROM Project_area Where Project_area.id_project =:id_project and Project_area.id_area =:id_area;`

    await sequelize
        .query(
            query, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id_project),
                    id_area: dataObj.req.sanitize(dataObj.req.params.id_area)
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
const confirmConnection = async (id_project, id_area) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Project_area Where id_project =:id_project and id_area = :id_area;`, {
            replacements: {
                id_project: id_project,
                id_area: id_area,
            }
        }, {
            model: ProjectAreaModel.Project_area
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