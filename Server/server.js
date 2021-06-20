require("dotenv").config();
// const Blob = require("cross-blob")
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const dbConnectionPack = require('../Server/Middleware/bdConnection')
const expressSanitizer = require("express-sanitizer");
const router = require("../Server/Routes/routes")
const fileUploader = require("express-fileupload");
const cors = require("cors");
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });
app.use(fileUploader());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
    extended: true
})); //Parse URL-encoded bodies
app.use(cors())
// app.use(Blob)

app.use(expressSanitizer());
app.use(router);

// 

// var httpServer = http.createServer(app);
// // var httpsServer = https.createServer(credentials, app);

app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);
});