var express = require("express"),
    app     = express();
    
app.set("view engine", "ejs");
    
app.get("/", function(req, res){
  res.render("landing");
});

app.get("/strains", function(req, res){
  var strains = [
    {name: "OG Kush", image: "https://images.weedmaps.com/photos/products/000/026/246/large/36827_supremeogkush_supremeog_2_01.jpg"},
    {name: "Purple Kush", image: "https://buyweedonlinewithbitcoins.com/wp-content/uploads/2016/12/Purple-Kush.jpg"},
    {name: "Master Kush", image: "http://cdn.shopify.com/s/files/1/1061/0012/products/master_kush-Solo_Flower_grande.jpg?v=1479965381"}
  ]
  
  res.render("strains", {strains:strains});
});
    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running."); 
});