const express = require('express');
const {
    register,
    login,
    currentUser,
    forgotPassword,
    profileUpdate,
    findPeople,
    addFollower,
    userFollow
} = require("../controllers/auth");
const {requireSignIn} = require("../middlewares/auth");

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/current-user',requireSignIn,currentUser);
router.post('/forgot-password',forgotPassword);
router.post('/update-profile',requireSignIn,profileUpdate);
router.get('/find-people',requireSignIn,findPeople);
router.put('/user-follow',requireSignIn,addFollower,userFollow);

module.exports = router;