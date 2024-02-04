const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {reviewValidate, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js");


//post review route
router.post("/",
isLoggedIn,
reviewValidate,
wrapAsync(reviewController.createReview));  

//delete review route
router.delete("/:reviewId",
isLoggedIn,
isReviewAuthor,
reviewValidate,
 wrapAsync(reviewController.deleteReview));

module.exports=router;
