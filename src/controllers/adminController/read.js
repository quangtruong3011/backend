import asyncHandler from "express-async-handler";
import employeeModel from "../../models/employee.model.js";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import postModel from "../../models/post.model.js";
import restaurantModel from "../../models/restaurant.model.js";

const getRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ createBy: id });

    res.status(200).send({
        message: "Get restaurant successfully",
        data: restaurant,
    });
});

const getAllOrders = asyncHandler(async (req, res) => {
    const allOrders = await bookingModel.find({});

    res.status(200).send({
        data: allOrders
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

const read = {
    getRestaurant,
    getAllOrders,
    getAllMenus,
    getProduct,
    getAllEmployees,
    getAllPosts,
    getTotals,
}

export default read;