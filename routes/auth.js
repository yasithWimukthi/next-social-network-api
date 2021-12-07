const express = require('express');
const {register,login,currentUser} = require("../controllers/auth");
const {requireSignIn} = require("../middlewares/auth");

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/current-user',requireSignIn,currentUser);

module.exports = router;