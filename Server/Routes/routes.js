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
// const focusController = require("../Controllers/focusController")
// const principalController = require("../Controllers/principalController")
// const hiringTipsController = require("../Controllers/hiringTipsController")
// const courseFocusController = require("../Controllers/courseFocusController")
const areaFocusController = require("../Controllers/areaFocusController")
const projectController = require("../Controllers/projectController")
const newsController = require("../Controllers/newsController")
//
const outsideInvestorController = require("../Controllers/outsideInvestorController")
const projectTeamController = require("../Controllers/projectTeamController")

//
const areaController = require("../Controllers/areaController")
const courseController = require("../Controllers/courseController")
const mediaController = require("../Controllers/mediaController")
const recruitmentController = require("../Controllers/recruitmentController")
const unityController = require("../Controllers/unityController")

//

//
const entityController = require("../Controllers/entityController");


const fs = require('fs')


//Middleware
let tokenPack = require("../Middleware/tokenFunctions");
const {
    url
} = require("inspector");
const {
    Outside_investor
} = require("../Models/OutsideInvestor");



//<DataStatus
router.get("/data_status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await dataStatusController.fetchAllDataStatus()
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


// DataStatus>

//*<UserStatus
/**
 * Fetch all user Status
 * Status:Completed
 */
router.get("/user_status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await userStatusController.fetchAllUserStatusDesignation()
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

//* UserStatus>

//*<UserLevel
/**
 * Fetch all user level
 * Status:Completed
 */
router.get("/user_levels", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await userLevelController.fetchAllUserLevelDesignation()
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

//* UserLevel>

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
    let fetchResult = await entityController.fetchMainEntityId()
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)

})




/**
 * Fetch all entities and his data based on an id
 * Status:Completed
 */
router.get("/entities/initials", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await entityController.fetchAllEntitiesInitials()
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
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

/**
 * Login
 * Status:Completed
 */
router.post("/users/login", async (req, res) => {
    let fetchResult = await userController.proceedUserLogin({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})

/**
 * Register
 * Status:Completed
 */
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

/**
 * 
 */
router.put("/users/:id/profile", async (req, res) => {

    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let putResult = await userController.editUserProfileByAdminOrProfileOwner({
            req: req,
            id_user: req.sanitize(req.params.id)
        })
        res.status(putResult.processRespCode).send(putResult.toClient)
    }
})



router.patch("/users/:id/profile/status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await userController.updateUserStatus({
            req: req,
            id_user: req.sanitize(req.params.id)
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})

// router.use('/UserProfilePicture', express.static(__dirname + "/Images/UserProfilePicture"))




/**
 * Fetch all users (restrict access only for Super admin or entity Admin)
 * Status:Completed
 */
router.get("/users", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await userController.fetchAllUsers(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})
/**
 * Profile fetch
 * Status:Completed
 */
router.get("/users/profile", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForProfileFetch(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await userController.fetchUserProfileById(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})
/**
 * Logged user profile edit, it knows with user to edit based on his url
 * Status:Completed
 */
router.put("/users/profile", async (req, res) => {
    console.log(req.headers);
    let tokenResult = await tokenPack.validateTokenForProfileFetch(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let putResult = await userController.editUserProfileByAdminOrProfileOwner({
            req: req,
            id_user: req.sanitize(tokenResult.toClient.processResult.id_user)
        })
        res.status(putResult.processRespCode).send(putResult.toClient)
    }
})


router.patch("/users/profile/picture", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let putResult = await userController.updateUserProfilePicture({
            req: req,
            id_user: req.sanitize(tokenResult.toClient.processResult.id_user)
        })
        res.status(putResult.processRespCode).send(putResult.toClient)
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



router.get("/areas", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaController.fetchAllAreasByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.put("/areas/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaController.editArea({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/areas", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaController.addArea({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.delete("/areas/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaController.deleteArea({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})










//*Areas Routes>





//*<Course Routes

router.get("/:lng/entities/:id/courses", async (req, res) => {
    let fetchResult = await courseController.fetchCourseByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})



router.get("/courses", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await courseController.fetchAllCourseByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.put("/courses/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await courseController.editCourse({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/courses", async (req, res) => {
    console.log("here");
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await courseController.addCourse({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.patch("/courses/:id/status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await courseController.updateStatusCourse({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})






router.delete("/courses/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await courseController.deleteCourse({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})






//*Course Routes>











//*<Media Routes

router.get("/:lng/entities/:id/medias", async (req, res) => {
    let fetchResult = await mediaController.fetchMediaByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


router.get("/media", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await mediaController.fetchAllMedia(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.put("/media/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await mediaController.editMedia({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/media", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await mediaController.addMedia({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.patch("/media/:id/status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await mediaController.updateMediaStatus({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})






router.delete("/media/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await mediaController.deleteMedia({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})








//*Media Routes>
//*<Available_position routes

router.get("/:lng/entities/:id/available_positions", async (req, res) => {
    let fetchResult = await recruitmentController.fetchAvailablePositionByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


//Admin 
router.get("/positions", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await recruitmentController.fetchAvailablePositionByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.put("/positions/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await recruitmentController.editAvailablePosition({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/positions", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await recruitmentController.addAvailable({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.delete("/positions/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await recruitmentController.deleteAvailablePosition({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


//*Available_position routes>

//*<Unit routes

router.get("/:lng/entities/:id/unities", async (req, res) => {
    let fetchResult = await unityController.fetchEntityUnityByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


router.get("/units", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await unityController.fetchUnitsByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})





router.put("/units/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await unityController.editUnit({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/units", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await unityController.addUnit({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})





router.patch("/units/:id/picture", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await unityController.updateUnitPicture({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})




router.delete("/units/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await unityController.deleteUnit({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

















//*Unit routes>





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


router.get("/areas/focus", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaFocusController.fetchAreaFocusByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.put("/areas/focus/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaFocusController.editAreaFocus({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/areas/focus", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaFocusController.addAreaFocus({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})





router.patch("/areas/focus/:id/icon", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await areaFocusController.updateAreaFocusPicture({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})




router.delete("/areas/focus/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await areaFocusController.deleteAreaFocus({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



//*Area Models >




//* Project models>
router.get("/:lng/entities/:id/projects", async (req, res) => {
    let fetchResult = await projectController.fetchEntityProjectByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})
// *Admin



router.get("/projects", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectController.fetchProjectByAdminAndDev(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/projects", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectController.addProject({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

router.patch("/projects/:id/file", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await projectController.updatePdf({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})


router.put("/projects/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await projectController.editProject({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})

router.patch("/projects/:id/status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await projectController.updateStatusProject({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})



router.post("/projects/:id/pictures", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectController.addProjectGalleryImage({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.delete("/projects/:id/pictures/:id_picture", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectController.deleteProjectGalleryImage({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

router.post("/projects/:id/investors", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await outsideInvestorController.addProjectOutsideInvestor({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.delete("/projects/:id/investors/:id_outside_investor", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await outsideInvestorController.deleteProjectInvestor({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.post("/projects/:id/news", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await newsController.addProjectNews({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})




router.post("/projects/:id/members", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectTeamController.addProjectMember({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.patch("/projects/:id/members/:id_team_member", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectTeamController.updateMemberEditionStatus({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})



router.delete("/projects/:id/members/:id_team_member", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await projectTeamController.deleteTeamMember({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})

//* Project Models>


// *News model  >
router.get("/:lng/entities/:id/news", async (req, res) => {
    let fetchResult = await newsController.fetchEntityNewsByIdEntity({
        req: req
    })
    res.status(fetchResult.processRespCode).send(fetchResult.toClient)
})


router.get("/pt/news", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await newsController.fetchNewsByAdmin(tokenResult.toClient.processResult)
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})





router.put("/pt/news/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await newsController.editNews({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})


router.post("/pt/news", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await newsController.addEntityNews({
            req: req,
            idUser: req.sanitize(tokenResult.toClient.processResult.id_user),
            idEntity: req.sanitize(tokenResult.toClient.processResult.id_entity),
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
})





router.patch("/pt/news/:id/picture", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await newsController.updateNewsPicture({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})


router.patch("/pt/news/:id/status", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    console.log(tokenResult);
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let patchResult = await newsController.updateStatusNews({
            req: req,
        })
        res.status(patchResult.processRespCode).send(patchResult.toClient)
    }
})



router.delete("/pt/news/:id", async (req, res) => {
    let tokenResult = await tokenPack.validateTokenForUsersMaxSecurity(req.sanitize(req.headers.authorization))
    if (tokenResult.processRespCode !== 200) {
        res.status(tokenResult.processRespCode).send(tokenResult.toClient)
    } else {
        let fetchResult = await newsController.deleteNews({
            req: req,
        })
        res.status(fetchResult.processRespCode).send(fetchResult.toClient)
    }
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