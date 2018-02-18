var express    = require("express"),
    Strain     = require("../models/strain"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware"),
    router     = express.Router({mergeParams: true});

// New comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // Find strain by id
  Strain.findById(req.params.id, function(err, strain){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {strain: strain});
    }
  });
});

// Comment post route
router.post("/", middleware.isLoggedIn, function(req, res){
  // Look up strain using ID
  Strain.findById(req.params.id, function(err, strain){
    if(err){
      console.log(err);
      res.redirect("/strains");
    } else {
      // Create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          // Add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();
          strain.comments.push(comment._id);
          strain.save();
          console.log(comment);
          req.flash("success", "Comment created!");
          res.redirect("/strains/" + strain._id);
        }
      });
      // Connect new comment to strain
      // Redirect to show page
    }
  });
});

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {strain_id: req.params.id, comment: foundComment});
    }
  });
});

// Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else {
      res.redirect("/strains/" + req.params.id);
    }
  });
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/strains/" + req.params.id);
    }
  });
});

module.exports = router;