const mongoose = require("mongoose");
const initdata = require("../Init/data.js");
const Listing = require("../Models/listing.js");

const url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connection Establised Suceessfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(url);
}

const initDB = async() => {
    await Listing.deleteMany({});
    // console.log(initdata.data);
    initdata.data = initdata.data.map((obj) =>  ({...obj , owner : "65c8a36df36f3b60abb2f23c"}));
    await Listing.insertMany(initdata.data);

    console.log("Data Was Initialised");
};

initDB();