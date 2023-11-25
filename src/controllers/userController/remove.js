import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";

const deleteBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId: bookingId });

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    await booking.deleteOne();

    res.status(200).send({
        message: "Delete booking successfully",
    });
});

const remove = {
    deleteBooking,
};

export default remove;