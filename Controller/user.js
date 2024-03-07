const User = require("../Models/user");

module.exports.renderSignUpForm = (req , res) => {
    res.render("Users/signup.ejs"); 
};

module.exports.signUp = async (req , res) => {
    try{
        let {username , email , password} = req.body ;
    const newuser = new User({username ,  email});
    let registerduser = await User.register(newuser , password);
    console.log(registerduser);
    req.login(registerduser , (err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listings");
    });   
    }
    catch(err){
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req , res) => {
    res.render("Users/login.ejs");
};

module.exports.login = async (req , res) => {
    req.flash("Success" , "Welcome back to Wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req ,res , next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        };
        req.flash("success" , "You are Logged Out !");
        res.redirect("/listings");
    });
};