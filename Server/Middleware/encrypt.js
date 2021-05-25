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
 * @param {Callback} callback 
 */
const decryptPassword = async (data, callback) => {
    // console.log(data);
    // let compare = await bcrypt.compare(data.password, data.hash)
    // console.log(compare);

    bcrypt.compare(data.password, data.hash, function (err, result) {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, result)
        }
    })
}


module.exports = {
    encryptPassword,
    decryptPassword
}