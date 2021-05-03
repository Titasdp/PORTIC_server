const express = require("express");
const router = express.Router(); // router
const userController = require("../Controllers/userController") // UserController
const dataStatusController = require("../Controllers/dataStatusController")
// const UserTitleController = require("../Controllers/userTitleController")
const userLevelController = require("../Controllers/userLevelController")
const userStatusController = require("../Controllers/userStatusController")
const entityLevelController = require("../Controllers/entityLevelController")
const socialMediaTypeController = require("../Controllers/socialMediaTypeController")
const categoryController = require("../Controllers/categoryController")



//<DataStatus
router.get("/dataStatus", (req, res) => {
    dataStatusController.getAllDataStatus(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//Init
router.post("/init/dataStatus", (req, res) => {
    dataStatusController.initDataStatus(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//!Unnecessary

// DataStatus>

//<UserStatus
//Init
router.post("/init/userStatus", (req, res) => {
    userStatusController.initUserStatus(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// UserStatus>



//<UserLevel
//Init
router.post("/init/userLevel", (req, res) => {
    userLevelController.initUserLevel(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// UserLevel>

//<EntityLevel
//Init
router.post("/init/entityLevel", (req, res) => {
    entityLevelController.initEntityLevel(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// EntityLevel>


//<SocialMediaType
//Init
router.post("/init/socialMediaType", (req, res) => {
    socialMediaTypeController.initSocialMediaType(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// SocialMediaType>


//<SocialMediaType
//Init
router.post("/init/socialMediaType", (req, res) => {
    categoryController.initCategory(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// SocialMediaType>



//<categoryController
//Init
router.post("/init/socialMediaType", (req, res) => {
    categoryController.initCategory(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// SocialMediaType>






// <User
router.get("/users", (req, res) => {
    userController.getAllUser(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//>


module.exports = router;