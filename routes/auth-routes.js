const router = require("express").Router();
const Admin = require("../models/Admin.model");
const bcrypt = require("bcryptjs");
const zxcvbn = require("zxcvbn");
const isLoggedIn = require("./../middleware/isLoggedIn");

const saltRounds = 10;

//* ROUTES

// GET /signup
router.get("/signup", isLoggedIn, (req, res) => {
    res.render("auth/signup-form", {loggedInUser: req.session.admin});
})

// POST /signup
router.post("/signup", (req, res) => {
    const {username, email, password} = req.body;
    const usernameNotProvided = !username || username === "";
    const emailNotProvided = !email || email === "";
    const passwordNotProvided = !password || password === "";
    if (usernameNotProvided || emailNotProvided || passwordNotProvided) {
        res.render("auth/signup-form", {errorMessage: "Provide username, e-mail and password"});
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!regex.test(password)) {
        res.status(400).render("auth/signup-form", {errorMessage: "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",});
        return;
    }
    
    // check if the username is not taken
    Admin.findOne({ $or: [{username}, {email}] })
        .then((foundAdmin) => {
            if (foundAdmin) {
                if (foundAdmin.username === username) {
                    throw new Error("This username is already in use");           
                } else if (foundAdmin.email === email) {
                    throw new Error("This email is already registered");
                }
            }
            // generator salt string
            return bcrypt.genSalt(saltRounds);
        })
        .then((salt) => {
            // encrypt password
            return bcrypt.hash(password, salt);
        })
        .then((hashedPassword) => {
            // create new admin
            return Admin.create({username: username, email: email, password: hashedPassword});
        })
        .then((createdAdmin) => {
            // redirect to the "/" homepage after successflul signup
            res.redirect("/");
        })
        .catch((err) => {
            res.render("auth/signup-form", {errorMessage: err.message || "Error while trying to signup"});
        })

})


// GET /login
router.get("/login", (req, res) => {
    res.render("auth/login-form")
})

// POST /login
router.post("/login", (req, res) => {
    const {username, password} = req.body;
    const usernameNotProvided = !username || username === "";
    const passwordNotProvided = !password || password === "";

    if (usernameNotProvided || passwordNotProvided) {
        res.render("auth/login-form", {errorMessage: "Provide username and password.",});
        return;
    }

    let admin;
    Admin.findOne({username})
        .then((foundAdmin) => {
            admin = foundAdmin;
            if (!foundAdmin) {
                throw new Error("Wrong credentials");
            }
            return bcrypt.compare(password, foundAdmin.password);
        })
        .then((isCorrectPassword) => {
            if (!isCorrectPassword) {
                throw new Error("Wrong credentials");
            } else if (isCorrectPassword) {
                // Create the session + cookie and redirect the user
                // This line triggers the creation of the session in the DB,
                // and setting of the cookie with session id that will be sent with the response
                req.session.admin = admin;
                res.redirect("/");
            }
        })
        .catch((err) => {
            res.render("auth/login-form", {errorMessage: err.message || "Provide username and password"});
        })
})


// GET /logout
router.get("/logout", (req, res) => {
    // Delete the session from the sessions collection
    // This automatically invalidates the future request with the same cookie
    req.session.destroy((err) => {
        if (err) {
            return res.render("error");
        }

        // if the session was deleted successfully redirect to the homepage
        res.redirect("/");
    });
});


module.exports = router;