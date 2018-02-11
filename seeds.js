var mongoose = require("mongoose");
var Strain = require("./models/strain");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Purple Kush",
        image: "https://www.legalweedsuppliers.com/wp-content/uploads/2016/08/1472582440488583-800x450.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        name: "OG Kush", 
        image: "https://images.weedmaps.com/photos/products/000/026/246/large/36827_supremeogkush_supremeog_2_01.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
        name: "Girl Scout Cookies", 
        image: "https://www.thecannabist.co/wp-content/uploads/2014/01/girl-scout-cookies-strain-theory-800x533.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
]

function seedDB(){
   //Remove all strains
   Strain.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed strains!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few strains
            data.forEach(function(seed){
                Strain.create(seed, function(err, strain){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a strain");
                        //create a comment
                        Comment.create(
                            {
                                text: "This stuff is the bomb! Never smoking anything else!",
                                author: "High Guy"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    strain.comments.push(comment._id);
                                    strain.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;