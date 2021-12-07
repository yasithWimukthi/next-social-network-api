import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

import User from '../models/user';
import {comparePassword, hashPassword} from "../helpers/auth";

export const register = async (req,res) => {
    const {name,email,password,secret} = req.body;

    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length<6){
        return res.status(400).send('Password is required and must be at least 6 characters');
    }
    if (!secret) return res.status(400).send('Answer is required');

    const exist = await User.findOne({email});

    if (exist) return res.status(400).send('Email is taken')

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
        console.log(`Registration Error: ${e}`);
        return res.status(400).send('Registration Error. Try again');
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if (!user) return res.status(400).send('User not found. Try again');

        const isPasswordMatch = comparePassword(password,user.password);
        if (!isPasswordMatch) return res.status(400).send('Password is wrong. Try again');

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
        return res.status(400).send('Login failed. Try again');
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