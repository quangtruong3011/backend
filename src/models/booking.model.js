import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
    },
    customerName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: String,
        required: true,
    },
    bookingTime: {
        type: String,
        required: true,
    },
    customerNumber: {
        type: Number,
        required: true,
    },
    menu: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 0,
        },
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
    ofRestaurant: {
        type: String,
    },
    tableId: [{
        type: String,
    }],
});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;