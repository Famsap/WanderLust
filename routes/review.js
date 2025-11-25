const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");



const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
};


//Reviews
//Post  Review route
//Post Review route
router.post("/", validateReview , wrapAsync(async (req, res)=>{
    console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   
   if (!listing) {
        throw new ExpressError(404, "Cannot add review to a non-existent Listing!");
    }

   let newreview = new Review(req.body.review);
   listing.reviews.push(newreview); 
   
   await newreview.save();
   await listing.save();
    req.flash("success", "New Review Created");
   console.log("New Review Added");
   res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;