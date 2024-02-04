const listing=require("../models/listing");
const Review=require("../models/review.js");

module.exports.createReview=async (req,res)=>{
    let Rlisting= await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    Rlisting.reviews.push(newReview);
   await newReview.save();
   await Rlisting.save();
   console.log("review saved");
   req.flash("success"," Review created Successfully!");
   res.redirect(`/listing/${Rlisting._id}`);
  };

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
   await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success"," Review Deleted Successfully!");
   res.redirect(`/listing/${id}`);

}