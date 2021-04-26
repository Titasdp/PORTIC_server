require("dotenv").config();
const express = require("express")
const bodyParser = require("body-parser");
const app = express()
const port = process.env.port || 3000
const dbConnectionPack = require('../Server/Middleware/bdConnection')
const expressSanitizer = require("express-sanitizer");
const router = require("../Server/Routes/routes")
// const UserModel = require('../Server/Models/User')

app.use(expressSanitizer());
app.use(router);

app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);
});