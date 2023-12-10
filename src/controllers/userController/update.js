import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";
import otpModel from "../../models/otp.model.js";

const updateBooking = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const otp = await otpModel.findOne({ bookingId: id, used: false });

    if (otp && req.body.otp == otp.otp) {
        const updatedBooking = await bookingModel.findOneAndUpdate(
            { bookingId: id },
            { ...req.body },
            { new: true }
        );
        await otpModel.findOneAndUpdate({ bookingId: id }, { used: true });
        res.status(200).send({
            message: "Booking updated successfully",
            data: updatedBooking
        });
    } else {
        res.status(401);
        throw new Error("Invalid OTP");
    }
});

const update = {
    updateBooking,
};

export default update;