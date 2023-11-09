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
        type: String,
        required: true,
    },
    menuBooking: [{
        item: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    createAt: {
        type: Date,
        default: Date.now(),
    },
    ofRestaurant: {
        type: String,
    },
});

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;