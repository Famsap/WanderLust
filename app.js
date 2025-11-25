const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsmate = require("ejs-mate");  // Used to setup ejs mate which is used to create constant l
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listingsRouter= require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

main()
.then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate); // setting up ejs mate as engine    
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res)=>{
    res.send("Hi i am root");
});




const sessionOptions = {
    secret: "mysupersecretstring" ,
    resave : false , 
    saveUninitialized: true ,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
         res.locals.success = req.flash("success");
         res.locals.error = req.flash("error"); 
        next();
})




async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email: "Faisalattar9898@gmail.com",
//         username: "Delta-Student"
//     });
//    let registerdUser =  await User.register(fakeUser, "helloworld");
//    res.send(registerdUser);
// })


app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));


//update Route

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));


//DElete Route

app.delete("/listings/:id",wrapAsync( async (req, res)=>{
    let {id}= req.params;
    let DeletedListing= await Listing.findByIdAndDelete(id);
    // console.log(DeletedListing);
    res.redirect("/listings");
}));



app.all("/*splat", (req, res, next)=>{
    next(new ExpressError(404, " 404 \n Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=404,message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs" , {message});
})


app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
