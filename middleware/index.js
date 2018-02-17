var middlewareObj = {},
    Strain        = require("../models/strain"),
    Comment       = require("../models/comment");

middlewareObj.checkOwnership = function(req, res, next) {
  // Is user logged in
  if(req.isAuthenticated()){
    Strain.findById(req.params.id, function(err, foundStrain){
      if(err){
        res.redirect("back");
      } else {
        // Does user own the strain
        if(foundStrain.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
  // Is user logged in
  if(req.isAuthenticated()){
    Strain.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        // Does user own the comment?
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


module.exports = middlewareObj;