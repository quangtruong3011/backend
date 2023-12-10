import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
    createBy: {
        type: String,
    },
    ofRestaurant: {
        type: String,
    },
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;