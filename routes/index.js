const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

// GET home page
router.get("/", (req, res, next) => {
  res.render("index", {loggedInUser: req.session.admin});
});

// GET /logout
// router.get("/", (req, res, next) => {
//   res.redirect("/logout");
//   res.render("index");
// });

// GET /secret
// router.get("/", isLoggedIn, (req, res) => {
//     res.render("index");
// })


module.exports = router;