import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    customerName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    bookingDate: {
        type: Date,
    },
    bookingTime: {
        type: Date,
    },
    customerNumber: {
        type: Number,
    },
    menu: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
        },
    }],
    table: [{
        type: String,
    }],
    total: {
        type: Number,
    },
    active: {
        type: Boolean,
        default: true,
    },
    checkIn: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;