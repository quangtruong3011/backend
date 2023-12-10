import asyncHandler from "express-async-handler";
import bookingModel from "../../models/booking.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import tableModel from "../../models/table.model.js";

const booking = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber, bookingDate, bookingTime, customerNumber, menu, note, ofRestaurant } = req.body;

    const newBooking = new bookingModel({
        customerName: customerName,
        phoneNumber: phoneNumber,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        customerNumber: customerNumber,
        menu: menu,
        note: note,
        restaurant: ofRestaurant,
    });

    await newBooking.save();

    res.status(201).send({
        message: "Create a booking successfully"
    });
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

const checkReservation = asyncHandler(async (req, res) => {

    const { customerName, phoneNumber } = req.body;

    const bookings = await bookingModel.aggregate([
        {
            $match: {
                customerName,
                phoneNumber
            }
        },
        {
            $lookup: {
                from: "restaurants",
                localField: "restaurant",
                foreignField: "restaurantId",
                as: "restaurant"
            }
        }
    ]);

    if (!bookings.length) {
        res.status(404);
        throw new Error("Booking not found");
    }

    const data = bookings.map(booking => {

        const restaurant = booking.restaurant[0];

        return {
            bookingId: booking.bookingId,
            customerName: booking.customerName,
            phoneNumber: booking.phoneNumber,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            customerNumber: booking.customerNumber,
            menu: booking.menu,
            note: booking.note,
            restaurantId: restaurant.restaurantId,
            restaurantName: restaurant.restaurantName,
            province: restaurant.province,
            district: restaurant.district,
            address: restaurant.address,
            imageUrl: restaurant.imageUrl
        };

    });

    res.status(200).json({
        message: "Check reservation successfully",
        data: data
    });

});

const create = {
    booking,
    getRestaurantsByProvince,
    getRestaurantByName,
    checkReservation,
};

export default create;
