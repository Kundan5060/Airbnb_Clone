const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const methodOverride=require("method-override");
const {isLoggedIn,isOwner,listingValidate}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.use(methodOverride("_method"));

//index and create route
router.
route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing));
    
// new route
router.get("/new",
    isLoggedIn,
    wrapAsync(listingController.renderNewForm));    

//show update delete route
router.route("/:id")
.get(listingValidate,
    wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing))
 .delete(
    isLoggedIn,
    isOwner,
    listingValidate,wrapAsync(listingController.deleteListing));
 
 //edit route
 router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    listingValidate,wrapAsync(listingController.renderEditForm));
 
 module.exports=router;