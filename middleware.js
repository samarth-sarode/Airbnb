const Listing = require("./Models/listing");
const Review = require("./Models/review");
const review = require("./Models/review.js");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req  , res , next) => {
    // console.log(req);
    // console.log(req.path," ",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        console.log(req.user);
        req.flash("error" , "You are Logged in to create Listings !");
        return res.redirect("/login");
    };
    next();
}


module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req , res , next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing =  (req , res , next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }{
        next();
    }
}


module.exports.validateReview =  (req , res , next) => {
    let {error} = reviewSchema.validate(req.body);
    console.log(error);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 , errMsg);
    }{
        next();
    }
}

module.exports.isReviewAuthor = async(req , res , next) => {
    let {id , reviewID} = req.params;
    // console.log(reviewID);
    let review = await Review.findById(reviewID);
    // console.log(review);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
