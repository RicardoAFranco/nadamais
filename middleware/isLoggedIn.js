// Custom middleware that checks if the request has a valid cookie
function isLoggedIn(req, res, next) {
    if (!req.session.admin) {
      return res.redirect("/login");
    } 

    next();

    if (req.session.admin) {
      return res
    }
  }

module.exports = isLoggedIn;