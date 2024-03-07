// require("dotenv").config();


if(process.env.NODE_ENV != "production"){
    require("dotenv").config;
}

const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");


const dburl = process.env.DB_URL;


const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require( "connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine" , "ejs");
app.set("Views" , path.join(__dirname , "Views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsmate);
app.use(express.static(path.join(__dirname , "/Public")));



main()
    .then(() => {
        console.log("Connection Establised Suceessfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(dburl);
}


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600,
});

const sessionOptions = {
    // store : store,
    store ,
    secret : process.env.SECRET,
    resave : "false",
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 *  60 * 60 * 1000,
    },
    httpOnly : true,

};

store.on("error" , () => {
    console.log("Error in Session Store" , store);
});

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req , res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
 
// app.get("/demouser" , async (req , res) => {
//     let fakeUser = new User({
//         email : "shreyas@gmail.com",
//         username : "Shreyas"
//     });

//    const newuser = await User.register(fakeUser , "password");
// //    console.log(newuser);
//     res.send(newuser);
// });

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/",userRouter);


app.all("*", ( req , res , next) => {
    next(new ExpressError(404 , "Page Not Found !"));  
});

//Middelware
app.use((err , req , res , next) => {
    // res.send("Something Went Wrong");
    let {statusCode = 500 , message = "Something Went Wrong"} = err;
    // console.log(message);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("Listings/error.ejs" , {message});
});


app.listen(port , () =>{
    console.log(`App Listning on Port ${port}`);
});