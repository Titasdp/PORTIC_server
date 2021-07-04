//MainModel
const RecruitmentCourseModel = require("../Models/RecruitmentCourse")

//Database Connection 
const sequelize = require("../Database/connection")



const createConnection = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id_available_position) || !dataObj.req.sanitize(dataObj.req.params.id_course)) {
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
    let fetchResult = await confirmConnection(dataObj.req.sanitize(dataObj.req.params.id_course), dataObj.req.sanitize(dataObj.req.params.id_available_position))

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
            `INSERT INTO Recruitment_course(id_course,id_available_position) VALUES (:id_course,:id_available_position);`, {
                replacements: {
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id_available_position),
                    id_course: dataObj.req.sanitize(dataObj.req.params.id_course)
                },
            }, {
                model: RecruitmentCourseModel.Recruitment_course
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
    let query = `DELETE FROM Recruitment_course Where Recruitment_course.id_course =:id_course and Recruitment_course.id_available_position =:id_available_position;`
    await sequelize
        .query(
            query, {
                replacements: {
                    id_available_position: dataObj.req.sanitize(dataObj.req.params.id_available_position),
                    id_course: dataObj.req.sanitize(dataObj.req.params.id_course)
                }
            }, {
                model: RecruitmentCourseModel.Recruitment_course
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
const confirmConnection = async (id_course, id_available_position) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Recruitment_course Where id_course =:id_course and id_available_position = :id_available_position;`, {
            replacements: {
                id_course: id_course,
                id_available_position: id_available_position,
            }
        }, {
            model: RecruitmentCourseModel.Recruitment_course
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