const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");

const validateListing = (req, res, next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
};

//Create Route
router.post("/",
    validateListing,
     wrapAsync(async (req, res, next)=>{
     // Creating error handler to check if listing data is present
    //let {title, description, image , price, country, location }= req.body;
    // let listing = req.body.listing;
    const newlisting = new Listing (req.body.listing);
    req.flash("success", "New listing Created");
    await newlisting.save();
    res.redirect("/listings")
    // console.log(listing);
}));

//Index Route
router.get("/", wrapAsync(async (req, res)=>{
   const Allistings = await Listing.find({});
   res.render("listings/index.ejs", {Allistings});
}));

//New Route

router.get("/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//Show Route

// Show Route
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Your listing does not exit");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));




//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Your listing does not exit");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));


//update Route

router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "New Listing Updated");
    res.redirect(`/listings/${id}`);
}));


//DElete Route

router.delete("/:id",wrapAsync( async (req, res)=>{
    let {id}= req.params;
    let DeletedListing= await Listing.findByIdAndDelete(id);
    // console.log(DeletedListing);
    req.flash("success", " listing Deleted");
    res.redirect("/listings");
}));


module.exports = router;