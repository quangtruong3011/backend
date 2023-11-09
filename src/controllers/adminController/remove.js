import asyncHandler from "express-async-handler";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import employeeModel from "../../models/employee.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import postModel from "../../models/post.model.js";

const deleteMenuItem = asyncHandler(async (req, res,) => {
    const productId = req.params.id;

    const menu = await menuModel.findOne({ productId: productId });

    if (!menu) {
        res.status(404).send({ message: "Menu not found" })
    };

    await menu.deleteOne();

    res.status(200).send({
        message: "Delete menu item successfully",
    });
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const employee = await employeeModel.findOne({ employeeId: employeeId });

    if (!employee) {
        res.status(404).send({ message: "Employee not found" });
    }

    res.status(200).send({
        message: "Delete employee successfully",
    });
});

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const post = await postModel.findOne({ postId: postId });

    if (!post) {
        return res.status(404).send({
            message: "Post not found",
        });
    };

    await post.deleteOne();

    res.status(200).send({
        message: "Delete post successfully",
    });
});

const deleteAllEmployees = asyncHandler(async (req, res) => {
    await employeeModel.deleteMany({});

    res.status(200).send({
        message: "Delete all employees successfully",
    });
});

const deleteAllMenus = asyncHandler(async (req, res) => {
    await menuModel.deleteMany({})

    res.status(200).send({
        message: "Delete all menus successfully",
    });
});

const deleteAllOrders = asyncHandler(async (req, res) => {
    await bookingModel.deleteMany({});

    res.status(200).send({
        message: "Delete all orders successfully",
    });
});

const deleteAllRestaurants = asyncHandler(async (req, res) => {
    await restaurantModel.deleteMany({});

    res.status(200).send({
        message: "Delete all restaurants successfully",
    });
});


const remove = {
    deleteMenuItem,
    deleteEmployee,
    deletePost,
    deleteAllMenus,
    deleteAllOrders,
    deleteAllEmployees,
    deleteAllRestaurants,
}

export default remove;