const express = require("express");
const app = express();
const router = express.Router();


//POSTS
//Indedx 
router.get("/", (req, res) => {
    res.send("Hi I am index route!");
});

//Show 
router.get("/:id", (req, res) => {
    res.send("Hi I am show route for post Id");
});

//POST 
router.post("/", (req, res) => {
    res.send("Hi I am POST route for user!");
});

//DELETE 
router.delete("/:id", (req, res) => {
    res.send("Hi I am DELETE route for user Id!");
});
module.exports = router;