require("dotenv").config();
const express = require("express")
const app = express()
const port = process.env.port || 3000
const dbConnectionPack = require('../Server/Middleware/bdConnection')
const UserModel = require('../Server/Models/User')


app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);
});