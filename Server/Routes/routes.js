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
const projectController = require("../Controllers/projectController")
const newsController = require("../Controllers/newsController")
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

//Init

// DataStatus>

//<UserStatus

// UserStatus>

//<UserLevel

// UserLevel>

//*<UserTitle
//*UserTitle>

//<EntityLevel

// EntityLevel>

//<SocialMediaType
//Init
// SocialMediaType>

//*<Category
//Init

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

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// *CommunicationLevel Routes>


// *<Entity Routes

// !Here brother
/**
 * Initialize entity
 * Status:Completed
 */



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
router.get("/entities/main", async (req, res) => {

    console.log("Presente no main");
    let fetchResult = await entityController.fetchMainEntityId()
    console.log(fetchResult);
    // fetchResult.toClient
    res.status(fetchResult.processRespCode).send("It has return")

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

//*Entity Email Routes>

//*<Entity Contact Routes


//*Entity Contact Routes>



//*<Entity Social Media  Routes

//*Entity Social Media Routes>

















//*<Entity Menu

//*Entity Menu>

//*<Entity Pages

//*Entity Pages>

// *<User
router.post("/users/login", async (req, res) => {
    let fetchResult = await userController.proceedUserLogin({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})



router.post("/users/register", async (req, res) => {
    let processResp = {}
    let entityFetchResult = await entityController.fetchEntityIdByDesignation(`Porto Research, Technology & Innovation Center`)
    let userStatusFetchResult = await userStatusController.fetchUserStatusIdByDesignation('Pendent Creation')
    let userLevelFetchResult = await userLevelController.fetchUserLevelIdByDesignation("Undefine");
    let userTitleFetchResult = await userTitleController.fetchTitleIdByDesignationInit('Indefinido')
    if (entityFetchResult.processRespCode === 500 || userStatusFetchResult.processRespCode === 500 || userLevelFetchResult.processRespCode === 500 || userTitleFetchResult.processRespCode === 500 || entityFetchResult.processRespCode === 204 || userStatusFetchResult.processRespCode === 204 || userLevelFetchResult.processRespCode === 204 || userTitleFetchResult.processRespCode === 204) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        res.status(processResp.processRespCode).send(processResp.toClient)
    } else {
        let addResult = await userController.proceedUserRegister({
            req: req,
            idUserLevel: userLevelFetchResult.toClient.processResult[0].id_user_level,
            idDataStatus: userStatusFetchResult.toClient.processResult[0].id_status,
            idEntity: entityFetchResult.toClient.processResult[0].id_entity,
            idTitle: userTitleFetchResult.toClient.processResult[0].id_title,

        })

        console.log(addResult);
        res.status(addResult.processRespCode).send(addResult.toClient)
    }


})
//*User>


//Todo new 

// *<Communication Level Routes

//*Communication level Routes>



//*<Areas Routes
router.get("/:lng/entities/:id/areas", async (req, res) => {
    let fetchResult = await areaController.fetchEntityAreaByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


//*Areas Routes>





//*<Course Routes

router.get("/:lng/entities/:id/courses", async (req, res) => {
    let fetchResult = await courseController.fetchCourseByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})



//*Course Routes>











//*<Media Routes

router.get("/:lng/entities/:id/medias", async (req, res) => {
    let fetchResult = await mediaController.fetchMediaByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})
//*Media Routes>








//*<Available_position routes

router.get("/:lng/entities/:id/available_positions", async (req, res) => {
    let fetchResult = await recruitmentController.fetchAvailablePositionByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})
//*Available_position routes>

//*<Unity routes

router.get("/:lng/entities/:id/unities", async (req, res) => {
    let fetchResult = await unityController.fetchEntityUnityByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})

//*Unity routes>





// *<Focus Routes
// router.get("/:lng/entities/:id/focus", async (req, res) => {
//     focusController.fetchEntityFocusByIdEntity({
//         req: req
//     }, (fetchSuccess, fetchResult) => {
//         res.status(fetchResult.processRespCode).send(fetchResult.toClient)
//     })
// })

//*Focus Routes>







// *<Hiring Tips
// router.get("/:lng/entities/:id/hiring_tips", async (req, res) => {
//     hiringTipsController.fetchHiringTipsByIdEntity({
//         req: req
//     }, (fetchSuccess, fetchResult) => {
//         res.status(fetchResult.processRespCode).send(fetchResult.toClient)
//     })
// })


//*Hiring tips>



//*< Course Focus Models
// router.get("/:lng/entities/:id/course_focus", async (req, res) => {
//     courseFocusController.fetchCourseFocusByIdEntity({
//         req: req
//     }, (fetchSuccess, fetchResult) => {
//         res.status(fetchResult.processRespCode).send(fetchResult.toClient)
//     })
// })



//*Course Focus Models >





//*< Area Focus Models


router.get("/:lng/entities/:id/area_focus", async (req, res) => {
    let fetchResult = await areaFocusController.fetchAreaFocusByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)

})

//*Area Models >




//* Project models>
router.get("/:lng/entities/:id/projects", async (req, res) => {
    let fetchResult = await projectController.fetchEntityProjectByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


//* Project Models>


// *News model  >
router.get("/:lng/entities/:id/news", async (req, res) => {
    let fetchResult = await newsController.fetchEntityNewsByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})
// *News model  >









// !!!!!!!!!!!!!!!!!!Init test  
router.post("/init/data", async (req, res) => {
    //First wave
    let firstWaveInitResult = await firstInitWave()
    if (firstWaveInitResult.error_five_hundred) {
        res.status(500).send({
            initSuccessResult: {
                firstWave: false,
                secondWave: false,
                thirdWave: false,
                fourthWave: false
            },
            processError: true,
            processMsg: "Something went wrong, please try again later.",
        })
    } else {
        // Second wave
        let entityLevelFetchResult = (await entityLevelController.fetchEntityLevelIdByDesignation("Primary"))
        let dataStatusFetchResult = (await dataStatusController.fetchDataStatusIdByDesignation("Published"))

        if (entityLevelFetchResult.processRespCode === 500 || dataStatusFetchResult.processRespCode === 500) {
            res.status(500).send({
                initSuccessResult: {
                    firstWave: true,
                    secondWave: false,
                    thirdWave: false,
                    fourthWave: false
                },
                processError: true,
                processMsg: "Something went wrong, please try again later.",
            })
        } else {
            let entityInitResult = await entityController.initEntity({
                idEntityLevel: entityLevelFetchResult.toClient.processResult[0].id_entity_level,
                idDataStatus: dataStatusFetchResult.toClient.processResult[0].id_status,
            })

            if (entityInitResult.processRespCode === 500) {
                res.status(500).send({
                    initSuccessResult: {
                        firstWave: true,
                        secondWave: false,
                        thirdWave: false,
                        fourthWave: false
                    },
                    processError: true,
                    processMsg: "Something went wrong, please try again later.",
                })
            } else {
                //Third Wave
                let entityFetchResult = await entityController.fetchEntityIdByDesignation(`Porto Research, Technology & Innovation Center`)
                let userStatusFetchResult = await userStatusController.fetchUserStatusIdByDesignation('Normal')
                let userLevelFetchResult = await userLevelController.fetchUserLevelIdByDesignation("Super Admin");
                let userTitleFetchResult = await userTitleController.fetchTitleIdByDesignationInit('Indefinido')

                if (entityFetchResult.processRespCode === 500 || userStatusFetchResult.processRespCode === 500 || userLevelFetchResult.processRespCode === 500 || userTitleFetchResult.processRespCode === 500) {
                    res.status(500).send({
                        initSuccessResult: {
                            firstWave: true,
                            secondWave: true,
                            thirdWave: false,
                            fourthWave: false
                        },
                        processError: true,
                        processMsg: "Something went wrong, please try again later.",
                    })
                } else {
                    let idEntity = entityFetchResult.toClient.processResult[0].id_entity

                    let userInitResult = await userController.initUser({
                        idUserLevel: userLevelFetchResult.toClient.processResult[0].id_user_level,
                        idDataStatus: userStatusFetchResult.toClient.processResult[0].id_status,
                        idEntity: idEntity,
                        idTitle: userTitleFetchResult.toClient.processResult[0].id_title,
                    })
                    if (userInitResult.processRespCode === 500) {
                        res.status(500).send({
                            initSuccessResult: {
                                firstWave: true,
                                secondWave: true,
                                thirdWave: true,
                                fourthWave: false
                            },
                            processError: true,
                            processMsg: "Something went wrong, please try again.",
                        })
                    } else {
                        let userFetchResult = await (await userController.fetchIdUserByUsername("superAdmin"))

                        if (userFetchResult.processRespCode === 500) {
                            res.status(500).send({
                                initSuccessResult: {
                                    firstWave: true,
                                    secondWave: true,
                                    thirdWave: true,
                                    fourthWave: false
                                },
                                processError: true,
                                processMsg: "Something went wrong, please try again.",
                            })
                        }

                        let idUser = userFetchResult.toClient.processResult[0].id_user
                        let idDataStatus = dataStatusFetchResult.toClient.processResult[0].id_status
                        console.log(idUser);

                        //Fourth Wave Init
                        let initMenusResult = await menuController.initMenu({
                            idEntity: idEntity,
                            idDataStatus: idDataStatus
                        })

                        let initAreasResult = await areaController.initAreas({
                            idEntity: idEntity,
                            idUser: idUser,
                        })

                        let initCourseResult = await courseController.initCourse({
                            idEntity: idEntity,
                            idUser: idUser,
                            idDataStatus: idDataStatus,
                        })


                        let initMediaResult = await mediaController.initMedia({
                            idEntity: idEntity,
                            idUser: idUser,
                            idDataStatus: idDataStatus,
                        })



                        let initRecruitmentResult = await recruitmentController.initAvailablePosition({
                            idEntity: idEntity,
                            idUser: idUser,
                        })


                        // // let initFocusResult = await focusController.initFocus({
                        // //     idEntity: idEntity,
                        // //     idUser: idUser,
                        // // })


                        // // let iniPrincipleResult = await principalController.initPrincipal({
                        // //     idEntity: idEntity,
                        // //     idUser: idUser,
                        // // })
                        // // console.log(iniPrincipleResult);


                        // // let initHiringTipResult = await hiringTipsController.initHiringTip({
                        // //     idEntity: idEntity,
                        // //     idUser: idUser,
                        // // })
                        // // console.log(initHiringTipResult);


                        let initEntityEmailResult = await entityEmailController.initEntityEmail({
                            idEntity: idEntity,
                            idUser: idUser,
                        })

                        let initEntityContactResult = await entityContactController.initEntityContact({
                            idEntity: idEntity,
                            idUser: idUser,
                        })



                        let initEntitySocialMediasResult = await socialMediaController.initSocialMediaType({
                            idEntity: idEntity,
                        })

                        let intiUnityResult = await unityController.initUnity({
                            idEntity: idEntity,
                            idCreator: idUser,
                            idDataStatus: idDataStatus
                        })

                        let initProjectResult = await projectController.initProject({
                            idEntity: idEntity,
                            idCreator: idUser,
                            idDataStatus: idDataStatus
                        })

                        let initAreaFocusResult = await areaFocusController.initAreaFocus({
                            idEntity: idEntity,
                            idCreator: idUser,
                        })

                        let initNewsResult = await newsController.initNews({
                            idEntity: idEntity,
                            idCreator: idUser,
                            idDataStatus: idDataStatus
                        })


                        console.log(initNewsResult);




                        if (initAreaFocusResult.processRespCode === 500 || initProjectResult.processRespCode === 500 || intiUnityResult.processRespCode === 500 || initEntitySocialMediasResult.processRespCode === 500 || initEntityContactResult.processRespCode === 500 || initEntityEmailResult.processRespCode === 500 || initRecruitmentResult.processRespCode === 500 || initMediaResult.processRespCode === 500 || initMenusResult.processRespCode === 500 || initAreasResult.processRespCode === 500 || initCourseResult.processRespCode === 500) {
                            res.status(500).send({
                                initSuccessResult: {
                                    firstWave: true,
                                    secondWave: true,
                                    thirdWave: true,
                                    fourthWave: false
                                },
                                processError: true,
                                processMsg: "Something went wrong, not all data where added, please try again!",
                            })
                        } else {
                            res.status(201).send({
                                initSuccessResult: {
                                    firstWave: true,
                                    secondWave: true,
                                    thirdWave: true,
                                    fourthWave: true
                                },
                                processError: true,
                                processMsg: "All init made successfully",
                            })
                        }
                    }
                }
            }

        }
    }

});



const firstInitWave = async () => {
    //#1-First inits (User Status, User Level, User title, Social media type, categories, entity Level) 
    let firstInitWaveResults = {
        error_five_hundred: false,
        data: {
            user_status_initResult: await userStatusController.initUserStatus(),
            user_level_initResult: await userLevelController.initUserLevel(),
            user_title_init_result: await userTitleController.initUserTitle(),
            social_media_type_init_result: await socialMediaTypeController.initSocialMediaType(),
            entity_level_init_result: await entityLevelController.initEntityLevel(),
            communication_level_init_result: await communicationLevelController.initCommunicationLevel(),
            categories_init_result: await categoryController.initCategory(),
            data_status_init_result: await dataStatusController.initDataStatus(),
        }
    }



    if (firstInitWaveResults.data.user_status_initResult.processRespCode === 500 || firstInitWaveResults.data.user_level_initResult.processRespCode === 500 || firstInitWaveResults.data.user_title_init_result.processRespCode === 500 || firstInitWaveResults.data.social_media_type_init_result.processRespCode === 500 || firstInitWaveResults.data.entity_level_init_result.processRespCode === 500 || firstInitWaveResults.data.communication_level_init_result.processRespCode === 500 || firstInitWaveResults.data.categories_init_result.processRespCode === 500 || firstInitWaveResults.data.data_status_init_result.processRespCode === 500) {
        firstInitWaveResults.error_five_hundred = true
    }

    return firstInitWaveResults
}







//unityController

module.exports = router;