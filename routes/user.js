const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controller/user.js");


router.route("/signup")
    .get(userController.renderSignUpForm)
    .post( wrapAsync(userController.signUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl ,
        passport.authenticate("local" , {
        failureRedirect : "/login" , 
        failureFlash : true
        }) , 
        userController.login
     );

router.get("/logout", userController.logout);

module.exports = router ;