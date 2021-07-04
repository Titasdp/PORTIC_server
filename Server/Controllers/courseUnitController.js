//MainModel
const CourseUnityModel = require("../Models/CourseUnity")

//Database Connection 
const sequelize = require("../Database/connection")


const createConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id_course) || !dataObj.req.sanitize(dataObj.req.params.id_unity)) {
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
    let fetchResult = await confirmConnection(dataObj.req.sanitize(dataObj.req.params.id_unity), dataObj.req.sanitize(dataObj.req.params.id_course))

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
            `INSERT INTO Course_unity(id_unity,id_course) VALUES (:id_unity,:id_course);`, {
                replacements: {
                    id_course: dataObj.req.sanitize(dataObj.req.params.id_course),
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id_unity)
                },
            }, {
                model: CourseUnityModel.Course_unity
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
    let query = `DELETE FROM Course_unity Where Course_unity.id_unity =:id_unity and Course_unity.id_course =:id_course;`
    await sequelize
        .query(
            query, {
                replacements: {
                    id_course: dataObj.req.sanitize(dataObj.req.params.id_course),
                    id_unity: dataObj.req.sanitize(dataObj.req.params.id_unity)
                }
            }, {
                model: CourseUnityModel.Course_unity
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
const confirmConnection = async (id_unity, id_course) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Course_unity Where id_unity =:id_unity and id_course = :id_course;`, {
            replacements: {
                id_unity: id_unity,
                id_course: id_course,
            }
        }, {
            model: CourseUnityModel.Course_unity
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