const UserModel = require("../Models/User")
const sequelize = require("../Database/connection")

//all userTypes
getAllUser = (req, callback) => {
    sequelize
        .query("SELECT * FROM User", {
            model: UserModel.User
        })
        .then(data => {
            let processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "Fetched successfully",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};
module.exports = {
    getAllUser
}