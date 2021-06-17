const bcrypt = require("bcrypt");


/**
 * Receives a password and encrypt it
 * Status:Completed
 * @param {String} password The password that is going to be encrypted
 * @param {Callback} callback 
 */
const encryptPassword = (password, callback) => {
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, hash)
        }
    })
}

/**
 * Compares a password sended by the client to an hash sended by the cliente
 * @param {Object} data Object that contains a password sended by the client and a hash fetched on inside the database
 */
const decryptPassword = async (data) => {
    return await new Promise((resolve, reject) => {
        let returnObj = {
            isError: false,
            compareSame: false,
        }
        bcrypt.compare(data.password, data.hash, function (err, result) {
            if (err) {
                console.log(err);
                returnObj.isError = true
                resolve(result)
            } else {
                returnObj.compareSame = result
                resolve(returnObj)
            }
        })
    })
}


module.exports = {
    encryptPassword,
    decryptPassword
}