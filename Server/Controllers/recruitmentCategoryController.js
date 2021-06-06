const RecruitmentCategoryModel = require("../Models/RecruitmentCategory")
const sequelize = require("../Database/connection")

const addRecruitmentCategory = async (dataObj) => {
    let processResult = {}
    if (dataObj.exist) {
        return callback(true, processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "The recruitment already has that category associated",
            }
        })
    }

    await sequelize
        .query(
            `INSERT INTO Recruitment_category (id_available_position, id_category) VALUES ${dataObj.insertArray.map(element => '(?)').join(',')};`, {
                replacements: dataObj.insertArray
            }, {
                model: RecruitmentCategoryModel.Recruitment_category
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new category was successfully created.",
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
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp
};


module.exports = {
    addRecruitmentCategory

}