const Listing = require("../Models/listing");
require("dotenv").config();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ;
// console.log(mapToken);
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async (req , res , next) => {
    const allListing = await Listing.find({});
    // res.send(allListing);
   
    res.render("Listings/index.ejs" , {allListing});
};

module.exports.createListing = async (req , res , next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    //   console.log(response);
    //   console.log(response.body);
        // console.log(response.body.features);
        // console.log(response.body.features[0].geometry);

        // res.send("done");

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(filename , url);
    let listing = req.body.listing;
    console.log(listing);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user.id; 
    newListing.image = {filename , url};
    newListing.geometry = response.body.features[0].geometry;
    console.log(newListing);
    await newListing.save();
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");  
};

module.exports.renderNewForm = (req , res) => {
    console.log(req.user);
    res.render("Listings/new.ejs");
};

module.exports.showListing = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
        path : "reviews" ,
        populate : {
            path : "author"
            },
        })
        .populate("owner");
    // console.log(id); 
    // console.log(listing);
    if(! listing ){
        req.flash("error" , "Listing you Requested for Does Not Exist");
        res.redirect("/listings");
    }
    res.render("Listings/show.ejs" ,{listing} );
};

module.exports.updateListing = async (req , res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename , url};
        await listing.save();
    }
    req.flash("success" , "New Listing Updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req , res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success" , "New Listing Deleted !");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(id);
    console.log(listing);
    let originalImageUrl = listing.image.url ;
    originalImageUrl.replace("upload" , "/upload/w_250");
    res.render("Listings/edit.ejs" , {listing , originalImageUrl});
    
};