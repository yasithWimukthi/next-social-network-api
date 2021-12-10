const express = require('express');
const {requireSignIn} = require("../middlewares/auth");
import formidable from 'express-formidable';
const {createPost,uploadImage,postsByUser} = require("../controllers/post");

const router = express.Router();


router.post('/create-post',requireSignIn,createPost);
router.post('/upload-image',requireSignIn,formidable({
    maxFileSize: 5*1024*1024
}),uploadImage);
router.get('/user-posts',requireSignIn,postsByUser);

module.exports = router;