require("dotenv").config();
const express = require("express")
const app = express()
const port = process.env.port || 3000
const dbConnectionPack = require('../Server/Middleware/bdConnection')
const sequelize = require("../Server/Database/connection.js");


app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);

    console.log(process.env.DB_HOST);
});