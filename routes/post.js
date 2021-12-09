const express = require('express');
const {requireSignIn} = require("../middlewares/auth");
const {createPost} = require("../controllers/post");

const router = express.Router();


router.post('/create-post',requireSignIn,createPost);

module.exports = router;