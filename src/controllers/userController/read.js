import asyncHandler from "express-async-handler";
import restaurantModel from "../../models/restaurant.model.js";
import menuModel from "../../models/menu.model.js";
import postModel from "../../models/post.model.js";
import bookingModel from "../../models/booking.model.js";
import otpModel from "../../models/otp.model.js";

const getAllRestaurants = asyncHandler(async (req, res) => {
    const allRestaurants = await restaurantModel.find({});
    res.status(200).send({
        message: "Get all restaurant successfully",
        data: allRestaurants,
    });
});

const getInfoRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const restaurantInfo = await restaurantModel.findOne({ restaurantId: restaurantId });

    res.status(200).send({
        message: "Get info restaurant successfully",
        data: restaurantInfo,
    });
});

const getAllMenus = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const allMenus = await menuModel.find({ restaurant: restaurantId });

    res.status(200).send({
        message: "Get all menu successfully",
        data: allMenus,
    });
});

const getBookings = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber } = req.query;

    const bookings = await bookingModel.find({
        customerName: customerName,
        phoneNumber: phoneNumber,
    });

    if (!bookings || bookings.length === 0) {
        res.status(404);
        throw new Error("Booking not found");
    }

    const allBookings = [];

    for (const booking of bookings) {
        const restaurant = await restaurantModel.findOne({ restaurantId: booking.restaurant });

        if (!restaurant) {
            res.status(404);
            throw new Error("Restaurant not found");
        }

        const bookingWithRestaurant = {
            bookingId: booking.bookingId,
            customerName: booking.customerName,
            phoneNumber: booking.phoneNumber,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            customerNumber: booking.customerNumber,
            note: booking.note,
            checkIn: booking.checkIn,
            restaurantName: restaurant.restaurantName,
            address: restaurant.address,
            restaurantImage: restaurant.imageUrl,
            checkIn: booking.checkIn,
        };

        allBookings.push(bookingWithRestaurant);
    }

    res.status(200).send({
        message: "Get bookings successfully",
        data: allBookings.reverse(),
    });
});

const getInfoBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId: bookingId });
    if (!booking || booking.length === 0) {
        res.status(404);
        throw new Error("Booking not found");
    }

    const menus = await menuModel.find({ restaurant: booking.restaurant });

    res.status(200).send({
        message: "Get info booking successfully",
        data: booking,
    });
});

// const getImageRestaurant = asyncHandler(async (req, res) => {
//     const restaurantId = req.params.id;

//     const posts = await postModel.find({ ofRestaurant: restaurantId }, "imageUrl");
//     const imageUrls = posts.map((post) => post.imageUrl);

//     res.status(200).send({
//         message: "Get image restaurant successfully",
//         data: imageUrls,
//     });
// });

const getImageRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const posts = await postModel.find({ ofRestaurant: restaurantId }, "imageUrl");
    const imageUrls = posts.map((post) => post.imageUrl).slice(0, 5);

    res.status(200).send({
        message: "Get image restaurant successfully",
        data: imageUrls,
    });
});

const getSuggestRestaurants = asyncHandler(async (req, res) => {
    const currentRestaurantId = req.params.id;
    const restaurants = await restaurantModel.find({ restaurantId: { $ne: currentRestaurantId } });

    res.status(200).send({
        message: "Get suggest restaurants successfully",
        data: restaurants,
    });
});

const getOtp = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const newOtp = new otpModel({
        otp: otp,
        bookingId: bookingId,
    });
    await newOtp.save();
    res.status(200).send({
        message: "Get otp successfully",
    });
});

const getProvince = asyncHandler(async (req, res) => {
    const provinces = await restaurantModel.find({ province: { $ne: null } }, "province");
    res.status(200).send({
        message: "Get province successfully",
        data: provinces,
    });
});

const read = {
    getAllRestaurants,
    getInfoRestaurant,
    getAllMenus,
    getImageRestaurant,
    getBookings,
    getInfoBooking,
    getSuggestRestaurants,
    getOtp,
    getProvince,
}

export default read;