const sequelize = require("../Database/connection");
testBdConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('The server connection to the BD has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


module.exports = {
    testBdConnection
}