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
// const pageController = require("../Controllers/pageController")
//
const entityEmailController = require("../Controllers/entityEmailController");
const entityContactController = require("../Controllers/entityContactController")
const socialMediaController = require("../Controllers/socialMediaController")
const focusController = require("../Controllers/focusController")
const principalController = require("../Controllers/principalController")
const hiringTipsController = require("../Controllers/hiringTipsController")
const courseFocusController = require("../Controllers/courseFocusController")
const areaFocusController = require("../Controllers/areaFocusController")
//

//
const areaController = require("../Controllers/areaController")
const courseController = require("../Controllers/courseController")
const mediaController = require("../Controllers/mediaController")
const recruitmentController = require("../Controllers/recruitmentController")
const unityController = require("../Controllers/unityController")

//
const pictureController = require("../Controllers/pictureController")
//
const entityController = require("../Controllers/entityController");



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

// !Here brother
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
                        imgPath: `${process.cwd()}/Server/Images/Logos/logoPortic.png`
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


/**
 * Fetch an entity and his data based on an id
 * Status:Completed
 */
router.get("/:lng/entities/:id", (req, res) => {

    entityController.fetchFullEntityDataById({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})




/**
 * Fetch an entity and his data based on an id
 * Status:Completed
 */
router.get("/entities/main", (req, res) => {
    entityController.fetchMainEntityId({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})




/**
 * Fetch an entity and his data based on an id
 * Status:Completed
 */
router.get("/:lng/entities/:id", (req, res) => {

    entityController.fetchFullEntityDataById({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})




// *Entity Routes> 

//*<Entity Email Routes
/** 
 * Status: Completed
 * !OBS: Future Adaptation with entity Init
 */
router.post("/init/entities/emails", async (req, res) => {
    let idEntity = null
    let communicationLevels = []
    let idUser = null

    //#0 - Completed
    await entityEmailController.fetchEmails(req, async (emailsFetchSuccess, emailsFetchResult) => {
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
                                entityEmailController.initEntityEmail({
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

//*<Entity Contact Routes
/** 
 * Status Completed 
 * !OBS: Future Adaptation with entity Init
 */
router.post("/init/entities/contacts", async (req, res) => {
    let idEntity = null
    let communicationLevels = []
    let idUser = null

    //#0 - Completed
    await entityContactController.fetchContacts(req, async (contactsFetchSuccess, contactsFetchResult) => {
        if (!contactsFetchSuccess) {
            res.status(contactsFetchResult.processRespCode).send(contactsFetchResult.toClient)
        } else if (contactsFetchSuccess) {
            if (contactsFetchResult.processRespCode === 200) {
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
                                //#5
                                entityContactController.initEntityContact({
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
//*Entity Contact Routes>



//*<Entity Social Media  Routes
/** 
 * todo 
 * !OBS: Future Adaptation with entity Init
 */
router.post("/init/entities/social_medias", async (req, res) => {
    let idEntity = null
    let socialMediaTypes = []
    //#0 - Completed
    await socialMediaController.fetchSocialEntitiesSocialMedias(req, async (socMediaFetchSuccess, socMediaFetchResult) => {
        if (!socMediaFetchSuccess) {
            res.status(socMediaFetchResult.processRespCode).send(socMediaFetchResult.toClient)
        } else if (socMediaFetchSuccess) {
            if (socMediaFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                await socialMediaTypeController.fetchSocialMediaTypes(req, (typesFetchSuccess, typesFetchResult) => {
                    if (!typesFetchSuccess) {
                        res.status(typesFetchResult.processRespCode).send(typesFetchResult.toClient)
                    } else if (typesFetchSuccess) {
                        if (typesFetchResult.processRespCode === 200) {
                            socialMediaTypes = typesFetchResult.toClient.processResult;
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
                            socialMediaController.initSocialMediaType({
                                idEntity: idEntity,
                                socialMediaTypes: socialMediaTypes,
                            }, (success, result) => {
                                res.status(result.processRespCode).send(result.toClient)
                            });
                        })
                    }
                })
            }
        }
    })
});
//*Entity Social Media Routes>

















//*<Entity Menu
/**
 * Initialize Menu
 * Status:Completed
 */
router.post("/init/entities/menus", async (req, res) => {
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
// //Todo
// router.post("/init/entities/pages", async (req, res) => {
//     let idEntity = null
//     let idDataStatus = null
//     let idUser = null
//     let menusIds = []
//     //#0

//     await pageController.fetchPages(req, async (pagesFetchSuccess, pagesFetchResult) => {
//         if (!pagesFetchSuccess) {
//             res.status(pagesFetchResult.processRespCode).send(pagesFetchResult.toClient)
//         } else if (pagesFetchSuccess) {
//             if (pagesFetchResult.processRespCode === 200) {
//                 res.status(409).send({
//                     processResult: null,
//                     processError: null,
//                     processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
//                 })
//             } else {
//                 //#1
//                 await menuController.fetchMenus(req, (menusFetchSuccess, menusFetchResult) => {
//                     if (!menusFetchSuccess) {
//                         res.status(menusFetchResult.processRespCode).send(menusFetchResult.toClient)
//                     } else if (menusFetchSuccess) {
//                         if (menusFetchResult.processRespCode === 200) {
//                             menusIds = menusFetchResult.toClient.processResult;
//                         }


//                         //#2
//                         entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
//                             if (!entityFetchSuccess) {
//                                 res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
//                             }

//                             if (entityFetchResult.processRespCode === 200) {
//                                 idEntity = entityFetchResult.toClient.processResult[0].id_entity
//                             }

//                             //#3
//                             dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
//                                 if (!statusFetchSuccess) {
//                                     res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
//                                 }

//                                 if (statusFetchResult.processRespCode === 200) {
//                                     idDataStatus = statusFetchResult.toClient.processResult[0].id_status
//                                 }

//                                 userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
//                                     if (!fetchUserSuccess) {
//                                         res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
//                                     }

//                                     if (fetchUserResult.processRespCode === 200) {
//                                         idUser = fetchUserResult.toClient.processResult[0].id_user
//                                     }

//                                     //#4
//                                     pageController.initPage({
//                                         idEntity: idEntity,
//                                         idDataStatus: idDataStatus,
//                                         idUser: idUser,
//                                         menusIds: menusIds
//                                     }, (success, result) => {
//                                         res.status(result.processRespCode).send(result.toClient)
//                                     });
//                                 })

//                             })
//                         })

//                     }

//                 })


//             }
//         }
//     })
// });

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



//*<Areas Routes
// router.get("/entities/main", (req, res) => {
//     entityController.fetchMainEntityId({
//         req: req
//     }, (fetchSuccess, fetchResult) => {
//         res.status(fetchResult.processRespCode).send(fetchResult.toClient)
//     })
// })




router.get("/:lng/entities/:id/areas", async (req, res) => {
    areaController.fetchEntityAreaByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/areas", async (req, res) => {
    let idEntity = null
    let idUser = null

    //#0

    await areaController.fetchAreas(req, async (pagesFetchSuccess, pagesFetchResult) => {
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
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }

                        //#3
                        areaController.initAreas({
                            idEntity: idEntity,
                            idUser: idUser,
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });
                    })

                })
            }
        }
    })
});

//*Areas Routes>





//*<Course Routes

router.get("/:lng/entities/:id/courses", async (req, res) => {
    courseController.fetchCourseByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/courses", async (req, res) => {
    let idEntity = null
    let idUser = null
    let idDataStatus = null


    //#0

    await courseController.fetchCourse(req, async (CourseFetchSuccess, CourseFetchResult) => {
        if (!CourseFetchSuccess) {
            res.status(CourseFetchResult.processRespCode).send(CourseFetchResult.toClient)
        } else if (CourseFetchSuccess) {
            if (CourseFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        //#3
                        dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                            if (!statusFetchSuccess) {
                                res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                            }

                            if (statusFetchResult.processRespCode === 200) {
                                idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                            }

                            //#3
                            courseController.initCourse({
                                idEntity: idEntity,
                                idUser: idUser,
                                idDataStatus: idDataStatus,
                            }, (success, result) => {
                                res.status(result.processRespCode).send(result.toClient)
                            });
                        })
                    })

                })
            }
        }
    })
});

//*Course Routes>











//*<Media Routes

router.get("/:lng/entities/:id/medias", async (req, res) => {
    mediaController.fetchMediaByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/medias", async (req, res) => {
    let idEntity = null
    let idUser = null
    let idDataStatus = null


    //#0

    await mediaController.fetchMedia(req, async (mediaFetchSuccess, mediaFetchResult) => {
        if (!mediaFetchSuccess) {
            res.status(mediaFetchResult.processRespCode).send(mediaFetchResult.toClient)
        } else if (mediaFetchSuccess) {
            if (mediaFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        //#3
                        dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                            if (!statusFetchSuccess) {
                                res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                            }

                            if (statusFetchResult.processRespCode === 200) {
                                idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                            }

                            //#3
                            mediaController.initMedia({
                                idEntity: idEntity,
                                idUser: idUser,
                                idDataStatus: idDataStatus,
                            }, (success, result) => {
                                res.status(result.processRespCode).send(result.toClient)
                            });
                        })
                    })

                })
            }
        }
    })
});

//*Media Routes>








//*<Available_position routes

router.get("/:lng/entities/:id/available_positions", async (req, res) => {
    recruitmentController.fetchAvailablePositionByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/available_positions", async (req, res) => {
    let idEntity = null
    let idUser = null
    let idDataStatus = null


    //#0

    await recruitmentController.fetchAvailablePositions(req, async (availablePosFetchSuccess, availablePosFetchResult) => {
        if (!availablePosFetchSuccess) {
            res.status(availablePosFetchResult.processRespCode).send(availablePosFetchResult.toClient)
        } else if (availablePosFetchSuccess) {
            if (availablePosFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        //#3

                        //#3
                        recruitmentController.initAvailablePosition({
                            idEntity: idEntity,
                            idUser: idUser,
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });
                    })
                })


            }
        }
    })
});

//*Available_position routes>

//*<Unity routes

router.get("/:lng/entities/:id/unities", async (req, res) => {
    unityController.fetchEntityUnityByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/unities", async (req, res) => {
    let idEntity = null
    let idUser = null
    let idDataStatus = null


    //#0
    await unityController.fetchAllUnities(req, async (unityFetchSuccess, unityFetchResult) => {
        if (!unityFetchSuccess) {
            res.status(unityFetchResult.processRespCode).send(unityFetchResult.toClient)
        } else if (unityFetchSuccess) {
            if (unityFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        //#3

                        // #4
                        dataStatusController.fetchDataStatusIdByName("Published", (statusFetchSuccess, statusFetchResult) => {
                            if (!statusFetchSuccess) {
                                res.status(statusFetchResult.processRespCode).send(statusFetchResult.toClient)
                            }

                            if (statusFetchResult.processRespCode === 200) {
                                idDataStatus = statusFetchResult.toClient.processResult[0].id_status
                            }

                            //#5
                            pictureController.initAddMultipleImgs({
                                insertArray: [`${process.cwd()}/Server/Images/UnitiesGalley/portoDesignFactory.jpg`, `${process.cwd()}/Server/Images/UnitiesGalley/startupPorto.jpg`, `${process.cwd()}/Server/Images/UnitiesGalley/portoBusinessInnovation.jpg`]
                            }, (imgAddSuccess, imgAddResult) => {
                                if (!imgAddSuccess) {
                                    res.status(imgAddResult.processRespCode).send(imgAddResult.toClient)
                                } else {
                                    console.log();
                                    //#6
                                    unityController.initUnity({
                                        idEntity: idEntity,
                                        idCreator: idUser,
                                        imgsIds: imgAddResult.toClient.processResult.generatedIds,
                                        idDataStatus: idDataStatus

                                    }, (success, result) => {
                                        res.status(result.processRespCode).send(result.toClient)
                                    });
                                }

                            })
                        })


                    })
                })


            }
        }
    })
});

//*Unity routes>





// *<Focus Routes
router.get("/:lng/entities/:id/focus", async (req, res) => {
    focusController.fetchEntityFocusByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/focus", async (req, res) => {
    let idEntity = null
    let idUser = null

    //#0

    await focusController.fetchFocus(req, async (focusFetchSuccess, focusFetchResult) => {
        if (!focusFetchSuccess) {
            res.status(focusFetchResult.processRespCode).send(focusFetchResult.toClient)
        } else if (focusFetchSuccess) {
            if (focusFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }

                        //#3
                        focusController.initFocus({
                            idEntity: idEntity,
                            idUser: idUser,
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });
                    })

                })
            }
        }
    })
});

//*Focus Routes>





// *<Focus Routes
router.get("/:lng/entities/:id/principals", async (req, res) => {
    principalController.fetchPrincipalsByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/principals", async (req, res) => {
    let idEntity = null
    let idUser = null

    //#0

    await principalController.fetchPrincipals(req, async (principalFetchSuccess, principalFetchResult) => {
        if (!principalFetchSuccess) {
            res.status(principalFetchResult.processRespCode).send(principalFetchResult.toClient)
        } else if (principalFetchSuccess) {
            if (principalFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }

                        //#3
                        principalController.initPrincipal({
                            idEntity: idEntity,
                            idUser: idUser,
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });
                    })

                })
            }
        }
    })
});

//*Focus Routes>




// *<Hiring Tips
router.get("/:lng/entities/:id/hiring_tips", async (req, res) => {
    hiringTipsController.fetchHiringTipsByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/hiring_tips", async (req, res) => {
    let idEntity = null
    let idUser = null
    //#0
    await hiringTipsController.fetchHiringTips(req, async (hiringTipFetchSuccess, hiringTipFetchResult) => {
        if (!hiringTipFetchSuccess) {
            res.status(hiringTipFetchResult.processRespCode).send(hiringTipFetchResult.toClient)
        } else if (hiringTipFetchSuccess) {
            if (hiringTipFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }

                        //#3
                        hiringTipsController.initHiringTip({
                            idEntity: idEntity,
                            idUser: idUser,
                        }, (success, result) => {
                            res.status(result.processRespCode).send(result.toClient)
                        });
                    })

                })
            }
        }
    })
});

//*Hiring tips>



//*< Course Focus Models
router.get("/:lng/entities/:id/course_focus", async (req, res) => {
    courseFocusController.fetchCourseFocusByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/course_focus", async (req, res) => {
    let idEntity = null
    let idUser = null
    let idDataStatus = null


    //#0
    await courseFocusController.fetchCourseFocus(req, async (focusFetchSuccess, focusFetchResult) => {
        if (!focusFetchSuccess) {
            res.status(focusFetchResult.processRespCode).send(focusFetchResult.toClient)
        } else if (focusFetchSuccess) {
            if (focusFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        // #3
                        pictureController.initAddMultipleImgs({
                            insertArray: [`${process.cwd()}/Server/Images/Icons/student.svg`, `${process.cwd()}/Server/Images/Icons/diversity.svg`, `${process.cwd()}/Server/Images/Icons/international.svg`, `${process.cwd()}/Server/Images/Icons/companies.svg`, `${process.cwd()}/Server/Images/Icons/prototype.svg`]
                        }, (imgAddSuccess, imgAddResult) => {
                            if (!imgAddSuccess) {
                                res.status(imgAddResult.processRespCode).send(imgAddResult.toClient)
                            } else {
                                //#6
                                courseFocusController.initCorseFocus({
                                    idEntity: idEntity,
                                    idCreator: idUser,
                                    imgsIds: imgAddResult.toClient.processResult.generatedIds,
                                }, (success, result) => {
                                    res.status(result.processRespCode).send(result.toClient)
                                });
                            }

                        })
                    })
                })


            }
        }
    })
});


//*Course Focus Models >





//*< Area Focus Models


router.get("/:lng/entities/:id/area_focus", async (req, res) => {
    areaFocusController.fetchAreaFocusByIdEntity({
        req: req
    }, (fetchSuccess, fetchResult) => {
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    })
})


router.post("/init/entities/area_focus", async (req, res) => {
    let idEntity = null
    let idUser = null
    //#0
    await areaFocusController.fetchAreaFocus(req, async (focusFetchSuccess, focusFetchResult) => {
        if (!focusFetchSuccess) {
            res.status(focusFetchResult.processRespCode).send(focusFetchResult.toClient)
        } else if (focusFetchSuccess) {
            if (focusFetchResult.processRespCode === 200) {
                res.status(409).send({
                    processResult: null,
                    processError: null,
                    processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
                })
            } else {
                //#1
                entityController.fetchEntityIdByName(`Porto Research, Technology & Innovation Center`, (entityFetchSuccess, entityFetchResult) => {
                    if (!entityFetchSuccess) {
                        res.status(entityFetchResult.processRespCode).send(entityFetchResult.toClient)
                    }

                    if (entityFetchResult.processRespCode === 200) {
                        idEntity = entityFetchResult.toClient.processResult[0].id_entity
                    }
                    //#2
                    userController.fetchUsedDataByUsername("superAdmin", (fetchUserSuccess, fetchUserResult) => {
                        if (!fetchUserSuccess) {
                            res.status(fetchUserResult.processRespCode).send(fetchUserResult.toClient)
                        }

                        if (fetchUserResult.processRespCode === 200) {
                            idUser = fetchUserResult.toClient.processResult[0].id_user
                        }
                        // #3
                        pictureController.initAddMultipleImgs({
                            insertArray: [`${process.cwd()}/Server/Images/Icons/search.svg`, `${process.cwd()}/Server/Images/Icons/tech.svg`, `${process.cwd()}/Server/Images/Icons/creativity.svg`, `${process.cwd()}/Server/Images/Icons/business.svg`, `${process.cwd()}/Server/Images/Icons/incubator.svg`, `${process.cwd()}/Server/Images/Icons/startup.svg`]
                        }, (imgAddSuccess, imgAddResult) => {
                            if (!imgAddSuccess) {
                                res.status(imgAddResult.processRespCode).send(imgAddResult.toClient)
                            } else {
                                //#6
                                areaFocusController.initAreaFocus({
                                    idEntity: idEntity,
                                    idCreator: idUser,
                                    imgsIds: imgAddResult.toClient.processResult.generatedIds,
                                }, (success, result) => {
                                    res.status(result.processRespCode).send(result.toClient)
                                });
                            }

                        })
                    })
                })
            }
        }
    })
});


//*Area Models >







//unityController

module.exports = router;