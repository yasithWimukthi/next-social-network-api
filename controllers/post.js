import cloudinary from 'cloudinary';
import Post from '../models/post';
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const createPost = async (req,res) => {
    const {content} = req.body;
    if (!content.trim()){
        return res.json({
            error : "Content is required."
        })
    }
    try{
        const post = new Post({content,postedBy:req.user._id});
        post.save();
        res.json(post)
    }
    catch (e) {
        console.log(e);
        return res.json({
            error : "Post is not saved. Try again."
        })
    }
}

export const uploadImage = async (req,res) => {

    cloudinary.uploader.upload(req.files.image.path)
        .then((result) => {
            return res.json({
                url : result.secure_url,
                public_id : result.public_id
            })
            console.log(result)
        }).catch((error) => {
            return res.json({
                error : "Image is not saved. Try again."
            })
            console.log(error)
    });
}