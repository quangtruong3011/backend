import asyncHandler from "express-async-handler";
import employeeModel from "../../models/employee.model.js";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import postModel from "../../models/post.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import tableModel from "../../models/table.model.js";
import adminModel from "../../models/admin.model.js";
import mongoose from "mongoose";
import moment from "moment";

const getInfo = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const admin = await adminModel.findOne({ _id: id });

    res.status(200).send({
        message: "Get info successfully",
        data: admin
    });
});

const getRestaurants = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ createBy: id });

    res.status(200).send({
        message: "Get restaurant successfully",
        data: restaurant,
    });
});

const getInfoRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const restaurant = await restaurantModel.findOne({ restaurantId: restaurantId });

    res.status(200).send({
        message: "Get info restaurant successfully",
        data: restaurant
    });
});

const getAllBookings = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const bookings = await bookingModel.find({ restaurant: restaurant.restaurantId });

    res.status(200).send({
        message: "Get all booking successfully",
        data: bookings,
    });
});

const getInfoBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const booking = await bookingModel.findOne({ bookingId: bookingId, restaurant: restaurant.restaurantId });

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Get booking successfully",
        data: booking,
    });
});

const getAllMenus = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const allMenus = await menuModel.find({ restaurant: restaurant.restaurantId });

    res.status(200).send({
        message: "Get all menu successfully",
        data: allMenus,
    });
});


const getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const product = await menuModel.findOne({ productId: productId });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    res.status(200).send({
        message: "Get product successfully",
        data: product,
    });
});

const getAllEmployees = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const allEmployees = await employeeModel.find({ restaurant: restaurant.restaurantId });

    res.status(200).send({
        message: "Get all employees successfully",
        data: allEmployees,
    });
});

const getInfoEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const employee = await employeeModel.findOne({ employeeId: employeeId });

    if (!employee) {
        res.status(404);
        throw new Error("Employee not found");
    }

    res.status(200).send({
        message: "Get info employee successfully",
        data: employee,
    });
});

const getAllPosts = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const allPosts = await postModel.find({ ofRestaurant: restaurant.restaurantId });
    allPosts.reverse();

    res.status(200).send({
        message: "Get all posts successfully",
        data: allPosts,
    });
});

const getInfoPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const post = await postModel.findOne({ postId: postId, ofRestaurant: restaurant.restaurantId });

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    res.status(200).send({
        message: "Get info post successfully",
        data: post,
    });
});

const getTotals = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const foundRestaurant = await restaurantModel.findOne({ createBy: id });

    if (!foundRestaurant) {
        res.status(404);
        throw new Error("Restaurant not found");
    }

    const menuCount = await menuModel.countDocuments({ restaurant: foundRestaurant.restaurantId });
    const orderCount = await bookingModel.countDocuments({ restaurant: foundRestaurant.restaurantId });
    const revenueSum = await bookingModel.find({ restaurant: foundRestaurant.restaurantId });
    let totalRevenue = 0;
    for (const revenue of revenueSum) {
        if (revenue?.total) {
            totalRevenue += revenue.total;
        }
    }
    const employeeCount = await employeeModel.countDocuments({ restaurant: foundRestaurant.restaurantId });

    res.status(200).send({
        message: "Get total successfully",
        data: {
            menuCount,
            orderCount,
            totalRevenue,
            employeeCount
        }
    });
});

const getTables = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const tables = await tableModel.find({ restaurant: restaurant.restaurantId });

    if (!tables) {
        res.status(404);
        throw new Error("Table not found");
    }

    res.status(200).send({
        message: "Get tables successfully",
        data: tables,
    });
});

const getInfoTable = asyncHandler(async (req, res) => {
    const tableId = req.params.id;
    const table = await tableModel.findOne({ tableId: tableId });

    if (!table) {
        res.status(404);
        throw new Error("Table not found");
    }

    res.status(200).send({
        message: "Get info table successfully",
        data: table,
    });
});

const getTableReady = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const tables = await tableModel.find({ restaurant: restaurant.restaurantId, status: "ready" });

    res.status(200).send({
        message: "Get tables ready successfully",
        data: tables
    });
});

const findTableReady = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const tables = await tableModel.find({ restaurant: restaurant.restaurantId });

    const currentTime = moment();

    let tableReady = [];

    tables.forEach(table => {
        table.info.forEach(info => {
            const bookingTime = moment(info.bookingTime);
            const hoursDiff = currentTime.diff(bookingTime, 'hours');

            if (hoursDiff > 3 || table.status === "ready") {
                tableReady.push(table);
            }
        });
        // if (table.status === "ready") {
        //     tableReady.push(table);
        //     table.info.forEach(info => {
        //         const bookingTime = moment(info.bookingTime);
        //         const hoursDiff = currentTime.diff(bookingTime, 'hours');

        //         if (hoursDiff > 3) {
        //             tableReady.push(table);
        //         }
        //     });
        // }
    });

    res.status(200).send({
        message: "Get tables ready successfully",
        data: tableReady
    });
});

const read = {
    getInfo,
    getRestaurants,
    getInfoRestaurant,
    getAllBookings,
    getInfoBooking,
    getAllMenus,
    getProduct,
    getAllEmployees,
    getInfoEmployee,
    getAllPosts,
    getInfoPost,
    getTotals,
    getTables,
    getInfoTable,
    getTableReady,
    findTableReady
}

export default read;