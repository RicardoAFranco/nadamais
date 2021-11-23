const router = require("express").Router();

// GET products page
router.get("/products", (req, res) => {
  res.render("products", {loggedInUser: req.session.admin});
});


module.exports = router;