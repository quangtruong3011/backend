import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: false,
    },
    restaurantId: {
        type: String,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        readOnly: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    openTime: {
        type: String,
        required: true,
    },
    closeTime: {
        type: String,
        required: true,
    },
    services: [{
        type: String,
        required: true,
    }],
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

export default restaurantModel;