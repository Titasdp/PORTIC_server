const express = require("express");
const router = express.Router(); // router
const userController = require("../Controllers/userController") // UserController
const dataStatusController = require("../Controllers/dataStatusController")
// const UserTitleController = require("../Controllers/userTitleController")
const userLevelController = require("../Controllers/userLevelController")
const userStatusController = require("../Controllers/userStatusController")
const userTitleController = require("../Controllers/userTitleController")
const entityLevelController = require("../Controllers/entityLevelController")
const socialMediaTypeController = require("../Controllers/socialMediaTypeController")
const categoryController = require("../Controllers/categoryController")
//
const communicationLevelController = require("../Controllers/communicationLevelController")
//
const menuController = require("../Controllers/menuController")
const pageController = require("../Controllers/pageController")
//
const EntityEmailController = require("../Controllers/entityEmailController")
//
//
const pictureController = require("../Controllers/pictureController")
//
const entityController = require("../Controllers/entityController");
const {
    Communication_level
} = require("../Models/CommunicationLevel");
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

//*<UserTitle
router.post("/init/userTitle", (req, res) => {
    userTitleController.initUserTitle(req, (success, result) => {
        res.status(result.processRespCode).send(result.toClient)
    });
});
//*UserTitle>

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
// //Init
// router.post("/init/communicationLevels", (req, res) => {
//     communicationLevelController.initCommunicationLevel(req, (success, result) => {
//         res.status(result.processRespCode).send(result.toClient)
//     });
// });
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// *CommunicationLevel Routes>


// *<Entity Routes
/**
 * Initialize entity
 * Status:Completed
 */
router.post("/init/entities", async (req, res) => {
    let idDataStatus = null;
    let idEntityLevel = null;


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

//*<Entity Email Routes

/** 
 * Status: Completed
 * !OBS: Future Adaptation with entity Init
 */
router.post("/init/entityEmails", async (req, res) => {
    let idEntity = null
    let communicationLevels = []
    let idUser = null

    //#0 - Completed
    await EntityEmailController.fetchEmails(req, async (emailsFetchSuccess, emailsFetchResult) => {
        if (!emailsFetchSuccess) {
            res.status(emailsFetchResult.processRespCode).send(emailsFetchResult.toClient)
        } else if (emailsFetchSuccess) {
            if (emailsFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {

                //#1
                await communicationLevelController.fetchCommunicationLevels(req, (comLevelFetchSuccess, comLevelFetchResult) => {
                    if (!comLevelFetchSuccess) {
                        res.status(comLevelFetchResult.processRespCode).send(comLevelFetchResult.toClient)
                    } else if (comLevelFetchSuccess) {
                        if (comLevelFetchResult.processRespCode === 200) {
                            communicationLevels = comLevelFetchResult.toClient.processResult;
                        }

                        //#2
                        entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                            if (!entityFetchSuccess) {
                                res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                            }

                            if (entityFetchResult.processRespCode === 200) {
                                idEntity = entityFetchResult.toClient.processResult[0].id_entity
                            }
                            //#4
                            userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                                if (!fetchUserSuccess) {
                                    res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                                }

                                if (fetchUserResult.processRespCode === 200) {
                                    idUser = fetchUserResult.toClient.processResult[0].id_user
                                }

                                //   #5
                                EntityEmailController.initEntityEmail({
                                    idEntity: idEntity,
                                    communicationLevels: communicationLevels,
                                    idUser: idUser
                                }, (success, result) => {
                                    res.status(result.processRespCode).send(result.toClient)
                                });
                            })
                        })
                    }

                })


            }
        }
    })
});


//*Entity Email Routes>


//*<Entity Menu
/**
 * Initialize Menu
 * Status:Completed
 */
router.post("/init/menus", async (req, res) => {
    let idEntity = null
    let idDataStatus = null
    //#0

    await menuController.fetchMenus(req, (menusFetchSuccess, menusFetchResult) => {
        if (!menusFetchSuccess) {
            res.status(menusFetchResult.processRespCode).send(menusFetchResult.toClient)
        } else if (menusFetchSuccess) {
            if (menusFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {



                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    } else {

                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }

                    //#1
                    dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                        if (!statusFetchSuccess) {
                            res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                        }

                        if (statusFetchResult.processRespCode === 200) {
                            idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                        }
                        //#2
                        menuController.initMenu({
                            idEntity: idEntity,
                            idDataStatus: idDataStatus
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });

                    })
                })
            }
        }

    })

});
//*Entity Menu>

//*<Entity Pages
//Todo
router.post("/init/pages", async (req, res) => {
    let idEntity = null
    let idDataStatus = null
    let idUser = null
    let menusIds = []
    //#0

    await pageController.fetchPages(req, async (pagesFetchSuccess, pagesFetchResult) => {
        if (!pagesFetchSuccess) {
            res.status(pagesFetchResult.processRespCode).send(pagesFetchResult.toClient)
        } else if (pagesFetchSuccess) {
            if (pagesFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                await menuController.fetchMenus(req, (menusFetchSuccess, menusFetchResult) => {
                    if (!menusFetchSuccess) {
                        res.status(menusFetchResult.processRespCode).send(menusFetchResult.toClient)
                    } else if (menusFetchSuccess) {
                        if (menusFetchResult.processRespCode === 200) {
                            menusIds = menusFetchResult.toClient.processResult;
                        }


                        //#2
                        entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                            if (!entityFetchSuccess) {
                                res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                            }

                            if (entityFetchResult.processRespCode === 200) {
                                idEntity = entityFetchResult.toClient.processResult[0].id_entity
                            }

                            //#3
                            dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                                if (!statusFetchSuccess) {
                                    res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                                }

                                if (statusFetchResult.processRespCode === 200) {
                                    idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                                }

                                userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                                    if (!fetchUserSuccess) {
                                        res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                                    }

                                    if (fetchUserResult.processRespCode === 200) {
                                        idUser = fetchUserResult.toClient.processResult[0].id_user
                                    }

                                    //#4
                                    pageController.initPage({
                                        idEntity: idEntity,
                                        idDataStatus: idDataStatus,
                                        idUser: idUser,
                                        menusIds: menusIds
                                    }, (success, result) => {
                                        res.status(result.processRespCode).send(result.toClient)
                                    });
                                })

                            })
                        })

                    }

                })


            }
        }
    })







});

//*Entity Pages>



// *<User
/**
 * Initialize User
 * Status:Completed
 */
router.post("/init/users", async (req, res) => {
    let idDataStatus = null;
    let idUserLevel = null;
    let idEntity = null;
    let idTitle = null

    //#0 -ToConfirm if there is something inside users
    userController.fetchUsers(req, async (usersFetchSuccess, usersFetchResult) => {
        if (!usersFetchSuccess) {
            res.status(usersFetchResult.processRespCode).send(usersFetchResult.toClient)
        } else {
            if (usersFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            }
            //#1
            await entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                if (!entityFetchSuccess) {
                    res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                }

                if (entityFetchResult.processRespCode === 200) {
                    idEntity = entityFetchResult.toClient.processResult[0].id_entity
                }
                // #2
                userStatusController.fetchUserStatusIdByName("Normal", (statusFetchSuccess, statusFetchResult) => {
                    if (!statusFetchSuccess) {
                        res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                    }

                    if (statusFetchResult.processRespCode === 200) {
                        idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                    }

                    // #3
                    userLevelController.fetchUserLevelIdByName("Super Admin", (userLevelFetchSuccess, userLevelFetchResult) => {
                        if (!userLevelFetchSuccess) {
                            res.status(userLevelFetchResult.processRespCode).send(userLevelFetchResult.toClient)
                        }
                        if (userLevelFetchResult.processRespCode === 200) {
                            idUserLevel = userLevelFetchResult.toClient.processResult[0].id_user_level
                        }


                        // #5
                        userTitleController.fetchTitleIdByDesignation({
                            selectedLang: "pt",
                            designationPt: "Indefinido",
                            designationEng: "Not Defined"
                        }, (userTitleFetchSuccess, userTitleFetchResult) => {
                            if (!userTitleFetchSuccess) {
                                res.status(userLevelFetchResult.processRespCode).send(userLevelFetchResult.toClient)
                            }
                            if (userTitleFetchResult.processRespCode === 200) {
                                idTitle = userTitleFetchResult.toClient.processResult[0].id_title
                            }
                            userController.initUser({
                                idUserLevel: idUserLevel,
                                idDataStatus: idDataStatus,
                                idEntity: idEntity,
                                idTitle: idTitle,
                            }, async (initUserSuccess, initUserResult) => {
                                res.status(initUserResult.processRespCode).send(initUserResult.toClient)
                            });
                        })
                    });
                });

            })










        }
    })







})
//*User>


//Todo new 

// *<Communication Level Routes
router.post("/init/communicationLevels", async (req, res) => {
    //#0 -ToConfirm if there is something inside Communication level
    communicationLevelController.fetchCommunicationLevels(req, async (fetchComLevelSuccess, fetchCommLevelResult) => {
        if (!fetchComLevelSuccess) {
            res.status(fetchCommLevelResult.processRespCode).send(fetchCommLevelResult.toClient)
        } else {
            if (fetchCommLevelResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                communicationLevelController.initCommunicationLevel({}, async (initSuccess, initResult) => {
                    res.status(initResult.processRespCode).send(initResult.toClient)
                });
            }
        }
    })
})
//*Communication level Routes>







module.exports = router;