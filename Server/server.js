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
var corsOptions = {
    // origin: 'http://localhost:8080',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT,POST, PATCH,DELETE"
}
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
app.use(cors(corsOptions))
// app.use(Blob)

app.use(expressSanitizer());

app.use(router);
app.use('/Images', express.static(__dirname + "/Images/"))
app.use('/Assets', express.static(__dirname + "/Assets/"));
// 

// var httpServer = http.createServer(app);
// // var httpsServer = https.createServer(credentials, app);

app.listen(port, async () => {
    await dbConnectionPack.testBdConnection();
    console.log(`PORTIC server is online and working on door: ${port}`);
});