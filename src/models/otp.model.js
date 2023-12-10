import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60,
    },
});

const otpModel = mongoose.model("Otp", otpSchema);

export default otpModel;