const Listing = require("../Models/listing");
const Review = require("../Models/review");


module.exports.createReview = async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let {id} = await req.params;
    // console.log(id);

    
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    newReview.author = req.user._id;

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Success !");
    // console.log(newReview);
    res.redirect(`/listings/${listing.id}`);
    // res.send("Data Saved");
};

module.exports.destroyReview = async (req , res) => {
    let {id  , reviewID} = req.params ;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewID}});
    await Review.findByIdAndDelete(reviewID); 
    req.flash("success" , "New Review Deleted !");
    res.redirect(`/listings/${id}`);
};

