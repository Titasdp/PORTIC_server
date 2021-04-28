const express = require("express");
const router = express.Router(); // router
const userController = require("../Controllers/userController") // UserController
const dataStatusController = require("../Controllers/dataStatusController")
const UserTitleController = require("../Controllers/userTitleController")
const UserLevelController = require("../Controllers/userLevelController")
const UserStatusController = require("../Controllers/userStatusController")
// //Return obj 
// let serverResp = {
//     queryResult: null,
//     queryError: null,
//     message: null,
// }


//<DataStatus
router.get("/dataStatus", (req, res) => {
    dataStatusController.getAllDataStatus(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
router.post("/initialize/dataStatus", (req, res) => {
    dataStatusController.getDataStatusIdByName(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//!Unnecessary
/* router.get("/dataSta/", (req, res) => {
    dataStatusController(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
}); */
// DataStatus>


// <User
router.get("/users", (req, res) => {
    userController.getAllUser(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//>


module.exports = router;