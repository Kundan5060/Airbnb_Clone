const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const {savedRedirctUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

//signup route
router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapasync(userController.signup));

//login route
router.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirctUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

router.get("/logout",userController.logout);
 
module.exports=router;