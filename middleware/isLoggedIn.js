// Custom middleware that checks if the request has a valid cookie
function isLoggedIn(req, res, next) {
    if (!req.session.admin) {
      return res.redirect("/login");
    } 
    // if (req.session.admin) {
    //   return res.redirect("/logout");
    // }
    next();
}

module.exports = isLoggedIn;