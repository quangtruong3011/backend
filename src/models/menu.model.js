import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    productId: {
        type: String,
    },
    productName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
    },
    rating: {
        type: Number,
        default: 5,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    ofRestaurant: {
        type: String,
        required: true,
    },
});

const menuModel = mongoose.model("Menu", menuSchema);

export default menuModel;