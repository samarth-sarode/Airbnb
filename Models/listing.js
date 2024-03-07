const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },

    description : {
        type : String ,
    },

    image : {
        filename :{
            type : String ,
        } ,
        url : {
            type : String,
            set : (v) => v === "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ? "default link" : v,
        }
        
    },

    price : {
        type : Number ,
    },

    location : {
        type : String ,
    },

    country : {
        type : String,
    },

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],

    owner : {
        type : Schema.Types.ObjectId ,
        ref : "User"

    },
    
    geometry: {
        type : {
            type : String ,
            enum : ["Point"],
            required : true ,
        },

        coordinates: {
            type : [Number],
            required : true
        }
    }
});

listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
           await review.deleteMany({_id : {$in : listing.reviews}});
    }

});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;