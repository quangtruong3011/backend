import asyncHandler from "express-async-handler";
import employeeModel from "../../models/employee.model.js";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import postModel from "../../models/post.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import tableModel from "../../models/table.model.js";

const getRestaurants = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const restaurant = await restaurantModel.find({ createBy: id });

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

    const bookings = await bookingModel.find({ ofRestaurant: restaurant.restaurantId });

    res.status(200).send({
        message: "Get all booking successfully",
        data: bookings,
    });
});

const getAllMenus = asyncHandler(async (req, res) => {
    const createBy = req.user.id;
    const allMenus = await menuModel.find({ createBy });

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
    const allEmployees = await employeeModel.find({});

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
    const allPosts = await postModel.find({});

    res.status(200).send({
        message: "Get all posts successfully",
        data: allPosts,
    });
});

const getTotals = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    if (!restaurant) {
        res.status(404);
        throw new Error("Restaurant not found")
    }
    const totalMenus = await menuModel.countDocuments({ ofRestaurant: restaurant.restaurantId });
    const totalOrders = await bookingModel.countDocuments({ ofRestaurant: restaurant.restaurantId });

    res.status(200).send({
        message: "Get total successfully",
        data: {
            totalMenus,
            totalOrders,
        }
    });
});

const getTables = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const tables = await tableModel.find({ ofRestaurant: restaurant.restaurantId });

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

const read = {
    getRestaurants,
    getInfoRestaurant,
    getAllBookings,
    getAllMenus,
    getProduct,
    getAllEmployees,
    getInfoEmployee,
    getAllPosts,
    getTotals,
    getTables,
    getInfoTable,
}

export default read;