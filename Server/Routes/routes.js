const express = require("express");
const router = express.Router(); // router
const userController = require("../Controllers/userController")

//Return obj 
let serverResp = {
    queryResult: null,
    queryError: null,
    message: null,
}

router.get("/users", (req, res) => {
    userController.getAllUser(req, result => {
        res.status(result.processRespCode).send(result.toClient)
    });
});


module.exports = router;