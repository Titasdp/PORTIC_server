const uniqid = require('uniqid')

generateRandomId = (tag) => {
    return uniqid('', `${tag}`)
}

module.exports = {
    generateRandomId
}