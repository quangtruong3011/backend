import asyncHandler from "express-async-handler";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import employeeModel from "../../models/employee.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import postModel from "../../models/post.model.js";
import tableModel from "../../models/table.model.js";

const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ restaurantId: restaurantId, createBy: id });

    if (!restaurant) {
        res.status(404).send({
            message: "Restaurant not found",
        });
        return;
    }

    await restaurant.deleteOne();

    res.status(200).send({
        message: "Restaurant deleted successfully",
    });
});

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

    await employee.deleteOne();

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

const deleteBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;
    const booking = await bookingModel.findOne({ bookingId: bookingId });

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    await booking.deleteOne();

    res.status(200).send({
        message: "Delete booking successfully"
    });
});


const deleteTable = asyncHandler(async (req, res) => {
    const tableId = req.params.id;

    const table = await tableModel.findOne({ tableId: tableId });

    if (!table) {
        res.status(404);
        throw new Error("Table not found");
    }

    await table.deleteOne();

    res.status(200).send({
        message: "Delete table successfully",
    })
})

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

const deleteAllPosts = asyncHandler(async (req, res) => {
    await postModel.deleteMany({});

    res.status(200).send({
        message: "Delete all posts successfully",
    });
});

const deletellTables = asyncHandler(async (req, res) => {
    await tableModel.deleteMany({});

    res.status(200).send({
        message: "Delete all tables successfully",
    });
});

const deleteExpiredBookings = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const thirtyMinutesAgo = new Date(currentDate.getTime() - 30 * 60 * 1000);
    const expiredBookings = await bookingModel.find({
        checkIn: false,
        bookingTime: { $lt: thirtyMinutesAgo },
    });

    for (const booking of expiredBookings) {
        await bookingModel.deleteOne({ _id: booking._id });
    }

    res.status(200).send({ message: "Delete auto booking successfully" });
});


const remove = {
    deleteRestaurant,
    deleteMenuItem,
    deleteEmployee,
    deletePost,
    deleteBooking,
    deleteTable,
    deleteAllMenus,
    deleteAllOrders,
    deleteAllEmployees,
    deleteAllRestaurants,
    deleteAllPosts,
    deletellTables,
    deleteExpiredBookings,
}

export default remove;