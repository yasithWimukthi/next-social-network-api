import Post from '../models/post';

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