//main model
const ProjectTeamModel = require("../Models/ProjectTeam")

//Database Connection 
const sequelize = require("../Database/connection")






const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_project FROM Project_team", {
            model: ProjectTeamModel.Project_team
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






const initProjectTeam = async (dataObj) => {
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
        [dataObj.idUser, dataObj.project1id, 1],
        [dataObj.idUser, dataObj.project2id, 1],
        [dataObj.idUser, dataObj.project3id, 1],
        [dataObj.idUser, dataObj.project4id, 1],
        [dataObj.idUser, dataObj.project5id, 1],
    ]
    await sequelize
        .query(
            `INSERT INTO Project_team (id_team_member,id_project,can_edit) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: ProjectTeamModel.Project_team
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












// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Admin !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


const addProjectMember = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.id_team_member) || !dataObj.req.sanitize(dataObj.req.body.can_edit)) {
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

    let fetchResult = await confirmConnectionProjectToUser(dataObj.req.sanitize(dataObj.req.params.id), dataObj.req.sanitize(dataObj.req.body.id_team_member))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    } else if (fetchResult.processRespCode === 200) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The user is already connected to the project.",
            }
        }
        return processResp
    }
    let insertArray = [
        [dataObj.req.sanitize(dataObj.req.body.id_team_member), dataObj.req.sanitize(dataObj.req.params.id), dataObj.req.sanitize(dataObj.req.body.can_edit)],
    ]
    await sequelize
        .query(
            `INSERT INTO Project_team (id_team_member,id_project,can_edit) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: ProjectTeamModel.Project_team
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



const deleteTeamMember = async (dataObj) => {
    let processResp = {}
    let query = `DELETE FROM Project_team Where Project_team.id_team_member =:id_team_member and Project_team.id_project =:id_project;`
    await sequelize
        .query(
            query, {
                replacements: {
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                    id_team_member: dataObj.req.sanitize(dataObj.req.params.id_team_member)
                },
                dialectOptions: {
                    multipleStatements: true
                }
            },
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data deleted Successfully",
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



/**
 * Patch  project member edition status 
 * StatusCompleted
 */
const updateMemberEditionStatus = async (dataObj) => {
    console.log(dataObj.req.body);
    console.log(dataObj.req.params);
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.can_edit)) {
        processResult = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Client request is incomplete!!"
            }
        }
        return processResult
    }

    await sequelize
        .query(
            `UPDATE Project_team SET Project_team.can_edit =:can_edit Where Project_team.id_project=:id_project and Project_team.id_team_member=:id_team_member`, {
                replacements: {
                    can_edit: (!(dataObj.req.sanitize(dataObj.req.body.can_edit))) ? 0 : ((dataObj.req.sanitize(dataObj.req.body.can_edit) !== 1 || dataObj.req.sanitize(dataObj.req.body.can_edit) !== 0) ? 0 : dataObj.req.sanitize(dataObj.req.body.can_edit)),
                    id_project: dataObj.req.sanitize(dataObj.req.params.id),
                    id_team_member: dataObj.req.sanitize(dataObj.req.params.id_team_member)
                }
            }, {
                model: ProjectTeamModel.Project_team
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The user possibility of editing the project has changed.",
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
 * Fetches team and user connection based on ids
 * Status: Complete
 */
const confirmConnectionProjectToUser = async (id_project, id_team_member) => {
    let processResp = {}
    await sequelize
        .query(`Select * from Project_team Where id_project =:id_project and id_team_member = :id_team_member;`, {
            replacements: {
                id_project: id_project,
                id_team_member: id_team_member,
            }
        }, {
            model: ProjectTeamModel.Project_team
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
    initProjectTeam,


    //admin 
    addProjectMember,
    deleteTeamMember,
    updateMemberEditionStatus
}