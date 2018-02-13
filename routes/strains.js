var express = require("express"),
    Strain  = require("../models/strain"),
    router  = express.Router();

// Index Route
router.get("/", function(req, res){
  // Get all strains from DB
  Strain.find({}, function(err, allStrains){
    if(err){
      console.log(err);
    } else {
      res.render("strains/index", {strains:allStrains});
    }
  });
});

// New Route
router.get("/new", isLoggedIn, function(req, res){
  res.render("strains/new");
});

// Create Route
router.post("/", isLoggedIn, function(req, res){
  //Get data from form and add to strains array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newStrain = {name: name, image: image, description: desc, author: author};
  //Create a new strain and save to DB
  Strain.create(newStrain, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //Redirect back to strains page
      console.log(newlyCreated);
      res.redirect("/strains");
    }
  });
});

// Show Route
router.get("/:id", function(req, res){
  //Find the strain with provided ID
  Strain.findById(req.params.id).populate("comments").exec(function(err, foundStrain){
    if(err) {
      console.log(err);
    } else {
      console.log(foundStrain);
      //Render show template with that strain
      res.render("strains/show", {strain: foundStrain});
    }
  });
});

// Edit strain route
router.get("/:id/edit", function(req, res){
  Strain.findById(req.params.id, function(err, foundStrain){
    if(err){
      res.redirect("/strains");
    } else {
      res.render("strains/edit", {strain: foundStrain});
    }
  });
});

// Update strain route
router.put("/:id", function(req, res){
  // Find and update the correct strain
  Strain.findByIdAndUpdate(req.params.id, req.body.strain, function(err, updatedStrain){
    if(err){
      res.redirect("/strains");
    } else {
      res.redirect("/strains/" + req.params.id);
    }
  });
  // Redirect to show page
});

// Destroy strain route
router.delete("/:id", function(req, res){
  Strain.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/strains");
    } else {
      res.redirect("/strains");
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;