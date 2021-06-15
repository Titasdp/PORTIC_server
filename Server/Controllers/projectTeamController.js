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

module.exports = {
    initProjectTeam
}