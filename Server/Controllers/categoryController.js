const CategoryModel = require("../Models/Category")
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId")


const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_category FROM Category", {
            model: CategoryModel.Category
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



/**
 * 
 * @param {*} req 
 * @param {*} callback 
 */
const initCategory = async () => {

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

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Category'), 'Digital Systems for Health and Telehealth'],
        [uniqueIdPack.generateRandomId('_Category'), 'Cibersecurity'],
        [uniqueIdPack.generateRandomId('_Category'), 'Health Technologies'],

    ]
    await sequelize
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
                    processResult: true,
                    processError: null,
                    processMsg: "All the data were successfully created.",
                }
            }
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: false,
                    processError: error,
                    processMsg: "Something went wrong please try again later.",
                }
            }

        });
    return processResp
};
/**
 * Function that returns Category id based on designation
 * Done
 */
const fetchCategoryIdByDesignation = async (designation) => {
    let processResp = {}
    await sequelize
        .query("SELECT id_category FROM Category where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CategoryModel.Category
        })
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Fetched successfully",
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};

/**
 * Function that adds a new category to the database
 * *Done
 */
const addCategory = (dataObj) => {
    let processResp = {}

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
const updateCategory = (dataObj, callback) => {
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

const simpleFetchCategoryIdByDesignation = async (designation) => {
    let processResult = null;
    await sequelize
        .query("SELECT id_category FROM Category where designation = :designation", {
            replacements: {
                designation: designation
            }
        }, {
            model: CategoryModel.Category
        })
        .then(data => {


            processResult = data[0]

        })
        .catch(error => {
            processResult = null

        });
    return processResult
};



const fetchCategoryByIdAvailablePosition = async (id_available_position) => {

    let progressResp = {}
    let query = `Select Category.id_category, Category.designation from ((Recruitment_category INNER JOIN Category ON Category.id_category = Recruitment_category.id_category ) INNER JOIN  Available_position on Available_position.id_available_position = Recruitment_category.id_available_position)  Where Available_position.id_available_position =:id_available_position`
    await sequelize
        .query(query, {
            replacements: {
                id_available_position: id_available_position
            }
        }, {
            model: CategoryModel.Category
        })
        .then(data => {

            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Fetched successfully",
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
    return processResp.toClient.processResult
}









module.exports = {
    addCategory,

    initCategory,
    fetchCategoryIdByDesignation,
    simpleFetchCategoryIdByDesignation,
    fetchCategoryByIdAvailablePosition
}