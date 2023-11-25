import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import mongoose from "mongoose";

const booking = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber, bookingDate, bookingTime, customerNumber, menuBooking, note, ofRestaurant } = req.body;

    const newBooking = new bookingModel({
        bookingId: new mongoose.Types.ObjectId(),
        customerName: customerName,
        phoneNumber: phoneNumber,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        customerNumber: customerNumber,
        menuBooking: menuBooking,
        note: note,
        ofRestaurant: ofRestaurant,
    });

    await newBooking.save();

    res.status(201).send({
        message: "Create a booking successfully"
    })
});

const getRestaurantsByProvince = asyncHandler(async (req, res) => {
    const { province } = req.body;
    const restaurants = await restaurantModel.find({});

    if (province === "") {
        res.status(200).send({
            message: "Get all restaurants successfully",
            data: restaurants,
        });
    } else {
        const restaurant = await restaurantModel.find({ province: province });
        res.status(200).send({
            message: "Get restaurants by province successfully",
            data: restaurant,
        });
    }
});

const getRestaurantByName = asyncHandler(async (req, res) => {
    const { restaurantName } = req.body;

    const restaurants = await restaurantModel.find({ restaurantName: { $regex: restaurantName, $options: 'i' } });

    if (restaurants.length === 0) {
        res.status(404);
        throw new Error("Restaurant not found");
    }

    res.status(200).send({
        message: "Get restaurant by name successfully",
        data: restaurants,
    });
});

const create = {
    booking,
    getRestaurantsByProvince,
    getRestaurantByName,
};

export default create;
