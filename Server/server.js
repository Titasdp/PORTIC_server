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
// process.cwd() +
// console.log(__dirname);
// console.log(process.cwd());

app.use(express.static('Images'))
app.use(fileUploader());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({
    extended: true
})); //Parse URL-encoded bodies
app.use(cors())
// app.use(Blob)

app.use(expressSanitizer());
app.use(router);

//Static files Routes
app.use('/Images', express.static(__dirname + "/Images/"))
// app.use('/Logos', express.static(__dirname + "/Images/Logos"))
// app.use('/ProjectsGallery', express.static(__dirname + "/Images/ProjectsGallery"))
// app.use('/NewsImagesGallery', express.static(__dirname + "/Images/NewsImagesGallery"))
// app.use('/UnitiesGalley', express.static(__dirname + "/Images/UnitiesGalley"))
// 

// var httpServer = http.createServer(app);
// // var httpsServer = https.createServer(credentials, app);

app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);
});