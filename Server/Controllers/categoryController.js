const CategoryModel = require("../Models/Category")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")

/**
 * Function that fetch all Category from the Database
 * Done
 */
fetchAllCategory = (req, callback) => {
    sequelize
        .query("SELECT * FROM Category", {
            model: CategoryModel.Category
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
/**
 * Function that adds predefined Category elements to the table
 * Done
 */
initCategory = (req, callback) => {
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Category'), 'Digital Systems for Health and Telehealth'],
        [uniqueIdPack.generateRandomId('_Category'), 'Cibersecurity'],
        [uniqueIdPack.generateRandomId('_Category'), 'Health Technologies'],

    ]
    sequelize
        .query(
            `INSERT INTO Category (id_category, designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CategoryModel.Category
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created.",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};
/**
 * Function that returns Category id based on designation
 * Done
 */
fetchCategoryIdByDesignation = async (designation, callback) => {
    console.log("here 2");
    await sequelize
        .query("SELECT id_category FROM Category where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CategoryModel.Category
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
            console.log(error);
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

/**
 * Function that adds a new category to the database
 * *Done
 */
addCategory = (dataObj, callback) => {
    if (dataObj.exist) {
        return callback(true, processResp = {
            processRespCode: 409,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "There is already and category with that description!",
            }
        })
    }
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Category'), dataObj.newCatDesignation],
    ]
    sequelize
        .query(
            `INSERT INTO Category (id_category, designation) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CategoryModel.Category
            }
        )
        .then(data => {
            let processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "A new category was successfully created.",
                }
            }
            return callback(false, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};
/**
 * Function that updates a Category
 * Done
 */
updateCategory = (dataObj, callback) => {
    if (dataObj.exist) {
        return callback(true, processResp = {
            processRespCode: 401,
            toClient: {
                processResult: data,
                processError: null,
                processMsg: "There is already and category with that description!",
            }
        })
    }
    sequelize
        .query(
            `UPDATE Category SET description = :newDescription WHERE id_task = :id AND deleted != 1;`, {
                replacements: {
                    newCatDesignation: dataObj.newCatDesignation,
                    id: dataObj.paramsId,
                }
            }, {
                model: CategoryModel.Category
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All the data were successfully created.",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }
            return callback(false, processResp)
        });
};









module.exports = {
    addCategory,
    fetchAllCategory,
    initCategory,
    fetchCategoryIdByDesignation
}