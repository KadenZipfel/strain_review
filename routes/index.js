var express  = require("express"),
    passport = require("passport"),
    User     = require("../models/user"),
    router   = express.Router();

// Landing Route
router.get("/", function(req, res){
  res.redirect("strains");
});

// Register form
router.get("/register", function(req, res){
  res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to CannaReviews, " + user.username);
      res.redirect("/strains");
    });
  });
});

// Login form
router.get("/login", function(req, res){
  res.render("login", {page: 'login'});
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/strains", 
  failureRedirect: "/login"
}), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/strains");
});

module.exports = router;