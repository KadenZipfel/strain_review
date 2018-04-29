var express    = require("express"),
    Strain     = require("../models/strain"),
    middleware = require("../middleware"),
    router     = express.Router(),
    multer     = require('multer');
    
var storage    = multer.diskStorage({
      filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
      }
    });
    
var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    upload = multer({ storage: storage, fileFilter: imageFilter}),
    cloudinary = require('cloudinary');
    
cloudinary.config({ 
  cloud_name: 'kzipfel', 
  api_key: 476779123835673, 
  api_secret: process.env.API_SECRET
});

// Index Route
router.get("/", function(req, res){
  var noMatch = null;
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // Get all strains from DB
    Strain.find({name: regex}, function(err, allStrains){
      if(err){
        console.log(err);
      } else {
        if(allStrains.length < 1){
          noMatch = "Sorry, strain not found.";
        }
        res.render("strains/index", {strains:allStrains, noMatch: noMatch});
      }
    });
  } else {
    // Get all strains from DB
    Strain.find({}, function(err, allStrains){
      if(err){
        console.log(err);
      } else {
        res.render("strains/index", {strains:allStrains, noMatch: noMatch});
      }
    });
  }
});

// New Route
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("strains/new");
});

// Create Route
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
  // //Get data from form and add to strains array
  // var name = req.body.name;
  // var image = req.body.image;
  // var type = req.body.type;
  // var desc = req.body.description;
  // var author = {
  //   id: req.user._id,
  //   username: req.user.username
  // }
  // var newStrain = {name: name, image: image, type: type, description: desc, author: author};
  // //Create a new strain and save to DB
  // Strain.create(newStrain, function(err, newlyCreated){
  //   if(err){
  //     console.log(err);
  //   } else {
  //     //Redirect back to strains page
  //     console.log(newlyCreated);
  //     res.redirect("/strains");
  //   }
  // });
  cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the strain object under image property
    req.body.strain.image = result.secure_url;
    // add author to strain
    req.body.strain.author = {
      id: req.user._id,
      username: req.user.username
    };
    Strain.create(req.body.strain, function(err, strain) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/strains/' + strain.id);
    });
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
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
  Strain.findById(req.params.id, function(err, foundStrain){
    if(err){
      console.log(err);
    }
    res.render("strains/edit", {strain: foundStrain});
  });
});

// Update strain route
router.put("/:id", middleware.checkOwnership, function(req, res){
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
router.delete("/:id", middleware.checkOwnership, function(req, res){
  Strain.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/strains");
    } else {
      res.redirect("/strains");
    }
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;