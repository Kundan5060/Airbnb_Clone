const listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index= async(req,res,)=>{
    const alllisting= await listing.find({});
    res.render("listing/index.ejs",{alllisting});
 };

 module.exports.renderNewForm=async (req,res,next)=>{
    res.render("listing/new.ejs");
 };

 module.exports.createListing=async (req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:2,
    })
    .send();

    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting= new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    await newlisting.save();
   
    req.flash("success"," New listing Created Successfully!");
    res.redirect("/listing");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const dlisting=  await listing.findById(id)
    .populate({path:"reviews",
   populate:{
       path:"author",
       },
   })
    .populate("owner");
    if(!dlisting){
       req.flash("error","Listing you requested Doesn't Exist!");
       res.redirect("/listing");
    }
    res.render("listing/show.ejs",{dlisting});
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const dlisting=  await listing.findById(id);
    if(!dlisting){
       req.flash("error","Listing you requested Doesn't Exist!");
       res.redirect("/listing");
    }
    let originalImageUrl= dlisting.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs",{dlisting,originalImageUrl});
};

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data");
    }
    let {id}=req.params;
   let update= await listing.findByIdAndUpdate(id,{...req.body.listing});

   if(typeof req.file!=="undefined"){
   let url=req.file.path;
    let filename=req.file.filename;
    update.image={url,filename};
    await update.save();
   }
   req.flash("success","listing Updated Successfully!");
   res.redirect(`/listing/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
  req.flash("success"," listing Deleted Successfully!");
   res.redirect("/listing");

};