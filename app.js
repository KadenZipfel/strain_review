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
  image: String
});

var Strain = mongoose.model("Strain", strainSchema);

// Strain.create({
//   name: "Purple Kush", 
//   image: "https://buyweedonlinewithbitcoins.com/wp-content/uploads/2016/12/Purple-Kush.jpg"
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

app.get("/strains", function(req, res){
  // Get all strains from DB
  Strain.find({}, function(err, allStrains){
    if(err){
      console.log(err);
    } else {
      res.render("strains", {strains:allStrains});
    }
  });
});

app.post("/strains", function(req, res){
  //Get data from form and add to strains array
  var name = req.body.name;
  var image = req.body.image;
  var newStrain = {name: name, image: image};
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

app.get("/strains/new", function(req, res){
  res.render("new");
});
    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});