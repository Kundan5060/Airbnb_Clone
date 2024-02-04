const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schemaValidate.js");
const listing=require("./models/listing");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(! req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must logged in before create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.savedRedirctUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    };
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing= await listing.findById(id);
    if(! Listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.listingValidate= (req,res,next)=>{
    let {error}= listingSchema.validate(req.body.listing);
    if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};

module.exports.reviewValidate = (req,res,next)=>{
    let {error}= reviewSchema.validate(req.body.listing);
    if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};