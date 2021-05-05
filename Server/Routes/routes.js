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
const communicationLevelController = require("../Controllers/communicationLevelController")
//
const entityController = require("../Controllers/entityController")
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
router.post("/init/userLevels", (req, res) => {
    userLevelController.initUserLevel(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// UserLevel>

//<EntityLevel
//Init
router.post("/init/entityLevels", (req, res) => {
    entityLevelController.initEntityLevel(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// EntityLevel>

//<SocialMediaType
//Init
router.post("/init/socialMediaTypes", (req, res) => {
    socialMediaTypeController.initSocialMediaType(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// SocialMediaType>

//*<Category
//Init
router.post("/init/categories", (req, res) => {
    categoryController.initCategory(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// Post new Cat
router.post("/categories", (req, res) => {
    categoryController.fetchCategoryIdByDesignation(req.sanitize(req.body.newCatDesignation), (success, result) => {
        if (success) {
            let dataObj = {
                newCatDesignation: req.sanitize(req.body.newCatDesignation),
                exist: false,
            }
            if (result.toClient.processResult.length > 0) {
                dataObj.exist = true
            }
            categoryController.addCategory(dataObj, (success, result) => {
                res.status(result.processRespCode).send(result.toClient)
            });
        } else {
            res.status(result.processRespCode).send(result.toClient)
        }
    });
});
// Patch category description
router.patch("/categories/:id", (req, res) => {
    categoryController.fetchCategoryIdByDesignation(req.sanitize(req.body.newCatDesignation), (success, result) => {
        if (success) {
            let dataObj = {
                newCatDesignation: req.sanitize(req.body.newCatDesignation),
                exist: false,
                paramsId: req.sanitize(req.params.id)
            }
            if (result.toClient.processResult.length > 0) {
                dataObj.exist = true
            }
            categoryController.addCategory(dataObj, (success, result) => {
                res.status(result.processRespCode).send(result.toClient)
            });
        } else {
            res.status(result.processRespCode).send(result.toClient)
        }
    });
});
// *Category>

//*<CommunicationLevel Routes
//Init
router.post("/init/communicationLevels", (req, res) => {
    communicationLevelController.initCommunicationLevel(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
// *CommunicationLevel Routes>


// *<Entity Routes
router.post("/init/entity", async (req, res) => {
    let data_status_id = null;
    let entity_level_id = null;
    // #3
    dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
        if (statusFetchSuccess) {
            console.log(statusFetchResult.toClient.processResult.length);
            if (statusFetchResult.toClient.processResult.length > 0) {
                data_status_id = statusFetchResult.toClient.processResult[0].id_status
            }
            // #2
            // entityLevelController.fetchAllEntityLevel(req, (entityLevelSuccess, entityLevelResult) => {
            //     if (entityLevelSuccess) {
            //         if (entityLevelResult.toClient.processResult[0].length > 0) {
            //             entity_level_id = entityLevelResult.toClient.processResult[0].id_status
            //         }
            //         //#3

            //         console.log(entity_level_id + " " + data_status_id);
            //          entityController.initEntity({
            //             data_status_id: data_status_id,
            //             entity_level_id: entity_level_id
            //         }, async (initEntitySuccess, initEntityResult) => {
            //             res.status(initEntityResult.processRespCode).send(initEntityResult.toClient)
            //         });
            //     }
            //     res.status(entityLevelResult.processRespCode).send(entityLevelResult.toClient)
            // });
        }
        res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
    });




})

// *Entity Routes> 

// <User
router.get("/users", (req, res) => {
    userController.getAllUser(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//>


module.exports = router;