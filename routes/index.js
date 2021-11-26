const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

// GET home page
router.get("/", (req, res, next) => {
  res.render("index", {loggedInUser: req.session.admin});
});


module.exports = router;