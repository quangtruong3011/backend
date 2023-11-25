import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";

const updateBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const updatedBooking = await bookingModel.findOneAndUpdate(
        { bookingId: bookingId },
        { ...req.body },
        { new: true }
    );

    if (!updatedBooking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Update booking successfully",
        booking: updatedBooking
    });
});

const update = {
    updateBooking,
};

export default update;