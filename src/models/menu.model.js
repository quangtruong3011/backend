import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        auto: true,
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
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
});

const MenuModel = mongoose.model("Menu", MenuSchema);

export default MenuModel;