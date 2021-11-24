const router = require("express").Router();
const Soap = require("../models/Soap.model");

// GET products page
router.get("/products", (req, res) => {
  Soap.find()
    .then((retrievedSoaps) => {
      res.render("products/products", {loggedInUser: req.session.admin, soapsList: retrievedSoaps});
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get("/product-detail/:soapId", (req, res) => {
  const mySoapId = req.params.soapId;
  Soap.findById(mySoapId)
    .then((retrievedSoap) => {
      res.render("products/product-detail", {loggedInUser: req.session.admin, soapDetail: retrievedSoap});
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get("/new-product", (req, res) => {
  res.render("products/new-product", {loggedInUser: req.session.admin});
})

router.post("/new-product", (req, res) => {
  const {name, description, durability, weight, price} = req.body;
  Soap.create({name, description, durability, weight, price})
  .then((createdSoap) => {
    res.redirect("products");
  })
  .catch((err) => {
    res.redirect("products/new-product");
  })
})


module.exports = router;