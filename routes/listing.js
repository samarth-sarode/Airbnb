const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const listingcontroller = require("../Controller/listing.js");
const multer = require("multer");


const {storage} = require("../cloudConfig.js");
const upload = multer({storage}) ;


// app.get("/" , (req , res) => {
    // console.log("You are on Home Page");
    // res.send("You are on Home Page");
// });
router.route("/")
    // Index Route
    .get(wrapAsync(listingcontroller.index))
    //Create Route
    .post( isLoggedIn ,  upload.single("listing[image.url]") , validateListing, wrapAsync(listingcontroller.createListing)
);


//New Route
router.get("/new" ,isLoggedIn , listingcontroller.renderNewForm);


router.route("/:id")
    //Show Route
    .get(wrapAsync( listingcontroller.showListing))
    
    //Update Route
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image.url]"),
        validateListing ,
        wrapAsync ( listingcontroller.updateListing ))

    //Delete Route
    .delete(
    isLoggedIn, 
    isOwner,
    wrapAsync (listingcontroller.destroyListing)
);



//Edit Route
router.get("/:id/edit" ,
    isLoggedIn, 
    isOwner,
    listingcontroller.renderEditForm
);

module.exports = router ;