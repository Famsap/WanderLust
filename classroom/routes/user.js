const express = require("express");
const app = express();
const router = express.Router();


//Indedx users
router.get("/users", (req, res) => {
    res.send("Hi I am index route!");
});

//Show user
router.get("/users/:id", (req, res) => {
    res.send("Hi I am show route for user Id");
});

//POST -users
router.post("/users", (req, res) => {
    res.send("Hi I am POST route for user!");
});

//DELETE -users
router.delete("/users/:id", (req, res) => {
    res.send("Hi I am DELETE route for user Id!");
});

module.exports = router;