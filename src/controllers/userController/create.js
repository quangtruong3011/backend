import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";

const Booking = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const { customerName, phoneNumber, bookingDate, bookingTime, customerNumber, menuBooking, note } = req.body;

    const newBooking = new bookingModel({
        customerName: customerName,
        phoneNumber: phoneNumber,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        customerNumber: customerNumber,
        menuBooking: menuBooking,
        note: note,
        ofRestaurantId: restaurantId
    });

    await newBooking.save();

    res.status(201).send({
        message: "Create a booking successfully"
    })
});

const create = {
    Booking,
};

export default create;
