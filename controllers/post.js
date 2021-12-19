import cloudinary from 'cloudinary';
import Post from '../models/post';
import User from '../models/user';
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const createPost = async (req,res) => {
    const {content,image} = req.body;
    if (!content.trim()){
        return res.json({
            error : "Content is required."
        })
    }
    try{
        const post = new Post({content,image,postedBy:req.user._id});
        post.save();
        return res.json({
            message : "Post is saved."
        })
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

export const postsByUser = async (req,res) => {
    try{
        // const posts = await Post.find({postedBy : req.user._id})
        const posts = await Post.find()
            .populate("postedBy", "_id name ,image")
            .sort({createdAt : -1})
            .limit(10)

        res.json(posts)
    }catch (e) {
        console.log(e);
    }
}

export const userPost = async (req,res) => {
    try {
        const post = await Post.findById(req.params._id)
            .populate("postedBy","_id name image ")
            .populate("comments.postedBy","_id name image " );
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}

export const updatePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params._id,req.body,{
            new: true
        });
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}

export const deletePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params._id);
        if (post.image && post.image.public_id){
            const image = await cloudinary.uploader.destroy(post.image.public_id);
        }
        res.json({ok:true});
    }
    catch (e) {
        console.log(e);
    }
}

export const newsFeed = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        let following = user.following;
        following.push(req.user._id);

        const posts = await Post.find({postedBy:{$in:following}})
            .populate("postedBy","_id name image ")
            .populate("comments.postedBy","_id name image " )
            .sort({createdAt: -1})
            .limit(10)
        res.json(posts);
    }catch (e) {
        console.log(e);
    }
}

export const likePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.body._id,
            {
                $addToSet:{likes: req.user._id}
            },
            {new:true}
        );
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}

export const unlikePost = async (req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(
            req.body._id,
            {
                $pull :{likes: req.user._id}
            },
            {new: true}
        ) ;
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}

export const addComment = async (req,res) => {
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push:{comments:{text:comment,postedBy:req.user._id}}
            },
            {new:true}
        )
            .populate("postedBy","_id name image ")
            .populate("comments.postedBy","_id name image " );
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}

export const removeComment = async (req,res) => {
    try {
        const {postId,comment} = req.body;
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $pull:{comments:{_id:comment._id}}
            },
            {new:true}
        );
        res.json(post);
    }catch (e) {
        console.log(e);
    }
}