const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const reviewController = require("../Controller/review.js");

//Post Reviews Route
router.post("" ,validateReview ,isLoggedIn , wrapAsync ( reviewController.createReview));



//Delete Review Route
router.delete("/:reviewID" , isLoggedIn , isReviewAuthor , wrapAsync(reviewController.destroyReview));

module.exports = router ;