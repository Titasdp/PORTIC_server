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
const pictureController = require("../Controllers/pictureController")
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
router.post("/init/entities", async (req, res) => {
    let idDataStatus = null;
    let idEntityLevel = null;
    let idLogo = null


    //#0
    await entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
        if (!entityFetchSuccess) {
            res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
        }

        if (entityFetchResult.processRespCode === 200) {
            res.status(409).send({
                processResult: null,
                processError: null,
                processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
            })
        } else {
            // #1
            dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                if (!statusFetchSuccess) {
                    res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                }

                if (statusFetchResult.processRespCode === 200) {
                    idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                }
                // #2
                entityLevelController.fetchEntityLevelIdByDesignation("Primary", (entityLevelFetchSuccess, entityLevelFetchResult) => {
                    if (!entityLevelFetchSuccess) {
                        res.status(entityLevelFetchResult.processRespCode).send(entityLevelFetchResult.toClient)
                    }
                    if (entityLevelFetchResult.processRespCode === 200) {
                        idEntityLevel = entityLevelFetchResult.toClient.processResult[0].id_entity_level
                    }
                    //#3
                    pictureController.addImgOnInit({
                        imgPath: `${process.cwd()}/Server/Images/Logos/logoToDel.png`
                    }, (imgAddSuccess, imgAddResult) => {
                        if (!imgAddSuccess) {
                            res.status(imgAddResult.processRespCode).send(imgAddResult.toClient)
                        }
                        //#4
                        entityController.initEntity({
                            idEntityLevel: idEntityLevel,
                            idDataStatus: idDataStatus,
                            idLogo: imgAddResult.toClient.processResult.generatedId
                        }, async (initEntitySuccess, initEntityResult) => {
                            res.status(initEntityResult.processRespCode).send(initEntityResult.toClient)
                        });
                    })

                });
            });
        }
    })





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