const router = require("express").Router();
const Soap = require("../models/Soap.model");
const fileUploader = require('../config/cloudinary.config');

// GET products page
router.get("/products", (req, res) => {
  Soap.find()
    .then((retrievedSoaps) => {
      res.render("products/products", { loggedInUser: req.session.admin, soapsList: retrievedSoaps });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get("/product-detail/:soapId", (req, res) => {
  const mySoapId = req.params.soapId;
  Soap.findById(mySoapId)
    .then((retrievedSoap) => {
      res.render("products/product-detail", { loggedInUser: req.session.admin, soapDetail: retrievedSoap });
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get("/new-product", (req, res) => {
  res.render("products/new-product", { loggedInUser: req.session.admin });
})

router.post("/new-product", fileUploader.single("image"), (req, res) => {
  const { name, description, durability, weight, price } = req.body;
  Soap.create({ name, description, durability, weight, price, imageUrl: req.file.path })
    .then((createdSoap) => {
      res.redirect("/products");
    })
    .catch((err) => {
      res.redirect("products/new-product");
    })
})

// GET route for querying a specific product from the database
// and pre-filling the edit form
router.get("/edit-product/:id", (req, res) => {
  const { id } = req.params;
  Soap.findById(id)
    .then((soapToEdit) => {
      res.render("products/edit-product", { loggedInUser: req.session.admin, soapToEdit: soapToEdit })
    })
    .catch((err) => console.log(err));
});

// POST route to save changes after updates in a specific product
router.post("/edit-product/:id", fileUploader.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, description, durability, weight, price } = req.body;

  let imageUrl;
  Soap.findById(id)
    .then((mySoap) => {

      if (req.file) {
        imageUrl = req.file.path;
      } else {
        imageUrl = mySoap.imageUrl
      }

    })
    .then(() => {
      Soap.findByIdAndUpdate(id, { name, description, durability, weight, price, imageUrl }, { new: true })
        .then(() => res.redirect(`/product-detail/${id}`))


    })
    .catch((err) => console.log(err));


});

// GET / route for delete product
router.get("/edit-product/:id/delete", (req, res) => {
  const { id } = req.params;
  Soap.findByIdAndDelete(id)
    .then((soapToRemove) => {
      res.redirect("/products");
    })
    .catch((err) => console.log(err));
})


module.exports = router;