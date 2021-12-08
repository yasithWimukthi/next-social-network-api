import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import User from '../models/user';
import {comparePassword, hashPassword} from "../helpers/auth";

export const register = async (req,res) => {
    const {name,email,password,secret} = req.body;

    if (!name.trim()) {
        return res.json({
            error : "Name is required."
        })
    }
    if (!password.trim() || password.length<6){
        return res.json({
            error : "New password is required and should be at least 6 characters."
        })
    }
    if (!secret.trim()) {
        return res.json({
            error : "Answer is required."
        })
    }

    const exist = await User.findOne({email});

    if (exist) {
        return res.json({
            error : "Email is taken."
        })
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
        name,
        email,
        password:hashedPassword,
        secret
    });

    try {
        await user.save();
        return res.json({
            ok: true
        })
    }catch (e) {
        return res.json({
            error : "Registration Error. Try again."
        })
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.json({
                error : "User not found. Try again."
            })
        }

        const isPasswordMatch = comparePassword(password,user.password);
        if (!isPasswordMatch) {
            return res.json({
                error : "Password is wrong. Try again."
            })
        }

        const token = jwt.sign({_id : user._id},process.env.JWT_SECRET,{
            expiresIn : '7d'
        });

        user.password = undefined;
        user.secret = undefined;

        res.json({
            token,
            user
        })
    }catch (err) {
        console.log(err);
        return res.json({
            error : "Login failed. Try again."
        })

    }
}

export const currentUser = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ok: true})
    }catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}

export const forgotPassword = async (req,res) => {
    const {email,newPassword,secret} = req.body;

    if(!newPassword.trim() || newPassword.length<6 ){
        return res.json({
            error : "New password is required and should be at least 6 characters."
        })
    }

    if(!secret.trim()){
        return res.json({
            error : "Secret is reqired."
        }) 
    }

    const user = await User.findOne({email,secret});

    if (!user){
        return res.json({
            error : "We can not verify you. Please try again."
        })
    }

    try{
        const hashedPassword = hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id,{password:hashedPassword});
        return res.json({
            error : "Password was changed. You can login with new password."
        })
    }
    catch (err) {
        console.log(err);
        return res.json({
            error : "Something went wrong. Please try again."
        })
    }

}