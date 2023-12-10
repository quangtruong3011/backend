import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: false,
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    restaurantName: {
        type: String,
    },
    province: {
        type: Number,
    },
    district: {
        type: Number,
    },
    ward: {
        type: Number,
    },
    address: {
        type: String,
    },
    openTime: {
        type: String,
    },
    closeTime: {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
    }],
    booking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
    }],
    employee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    }],
    table: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
    }],
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
});

const restaurantModel = mongoose.model("Restaurant", restaurantSchema);

export default restaurantModel;