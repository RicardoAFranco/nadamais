const router = require("express").Router();

// GET contacts page
router.get("/contacts", (req, res) => {
  res.render("contacts", {loggedInUser: req.session.admin});
});


module.exports = router;