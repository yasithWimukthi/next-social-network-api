import User from '../models/user';
import {hashPassword} from "../helpers/auth";

export const register = async (req,res) => {
    const {name,email,password,secret} = req.body;

    if (!name) return res.status(400).send('Name is required');
    if (!password || password.length<=6){
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