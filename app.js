var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    app        = express();
    
mongoose.connect("mongodb://localhost/cannareviews");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema Setup
var strainSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Strain = mongoose.model("Strain", strainSchema);

// Strain.create({
//   name: "Purple Kush", 
//   image: "https://buyweedonlinewithbitcoins.com/wp-content/uploads/2016/12/Purple-Kush.jpg",
//   description: "A very sedative strain with great pain relief."
// }, function(err, strain){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("New strain: ");
//     console.log(strain);
//   }
// });
    
app.get("/", function(req, res){
  res.render("landing");
});

// Index Route
app.get("/strains", function(req, res){
  // Get all strains from DB
  Strain.find({}, function(err, allStrains){
    if(err){
      console.log(err);
    } else {
      res.render("index", {strains:allStrains});
    }
  });
});

// Create Route
app.post("/strains", function(req, res){
  //Get data from form and add to strains array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newStrain = {name: name, image: image, description: desc};
  //Create a new strain and save to DB
  Strain.create(newStrain, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      //Redirect back to strains page
      res.redirect("/strains");
    }
  });
});

// New Route
app.get("/strains/new", function(req, res){
  res.render("new");
});

// Show Route
app.get("/strains/:id", function(req, res){
  //Find the strain with provided ID
  Strain.findById(req.params.id, function(err, foundStrain){
    if(err) {
      console.log(err);
    } else {
      //Render show template with that strain
      res.render("show", {strain: foundStrain});
    }
  });
});
    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});