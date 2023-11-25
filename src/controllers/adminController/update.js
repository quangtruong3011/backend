import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import restaurantModel from "../../models/restaurant.model.js";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import tableModel from "../../models/table.model.js";
import mongoose from "mongoose";
import moment from "moment/moment.js";
import { log, table } from "console";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const updateRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;
    const { restaurantName, address, openTime, closeTime, description } = req.body;
    const imageFile = req.file;
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ restaurantId: restaurantId, createBy: id });

    if (!restaurant) {
        return res.status(404).send({
            message: "Restaurant not found",
        });
    }

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    restaurant.restaurantName = restaurantName;
    restaurant.address = address;
    restaurant.openTime = openTime;
    restaurant.closeTime = closeTime;
    restaurant.description = description;
    restaurant.imageUrl = imageUrl;
    await restaurant.save();

    res.status(200).send({
        message: "Restaurant updated successfully",
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const imageFile = req.file;

    const product = await menuModel.findOne({ productId: productId });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    product.productName = req.body.productName;
    product.category = req.body.category;
    product.description = req.body.description;
    product.unit = req.body.unit;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.imageUrl = imageUrl;

    await product.save();

    res.status(201).send({
        message: "Update product successfully"
    });
});


const checkIn = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    if (!updateBooking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Update booking successfully",
        booking: updateBooking,
    });
});

const order = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId });

    if (!booking) {
        res.status(404).send("Booking not found");
        return;
    }

    const newMenu = req.body;

    newMenu.forEach(item => {
        const existingMenuIndex = booking.menu.findIndex(i => i.productId === item.productId);
        if (existingMenuIndex !== -1) {
            booking.menu[existingMenuIndex].quantity += item.quantity;
        } else {
            booking.menu.push(item);
        }
    });

    await booking.save();

    res.status(200).send({
        message: "Booking updated successfully",
        booking,
    });
});

const payment = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId: bookingId });

    if (!booking) {
        res.status(404).send("Booking not found");
        return;
    }

    booking.total = req.body.total;
    booking.active = false;

    await booking.save();

    res.status(200).send({
        message: "Booking updated successfully",
        booking,
    });
});

const updateInfoTable = asyncHandler(async (req, res) => {
    const tableId = req.params.id;

    const updateTable = await tableModel.findOneAndUpdate(
        { tableId: tableId },
        { ...req.body },
        { new: true }
    );

    if (!updateTable) {
        res.status(404);
        throw new Error("Table not found");
    }

    res.status(200).send({
        message: "Update table successfully",
    });
});

const openTable = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const tableId = req.params.id;
    const { customerName, phoneNumber } = req.body;
    const table = await tableModel.findOne({ tableId: tableId });

    if (!table) {
        res.status(404);
        throw new Error("Table not found");
    }

    const newBooking = new bookingModel({
        bookingId: new mongoose.Types.ObjectId(),
        customerName: customerName,
        phoneNumber: phoneNumber,
        bookingTime: moment().format("HH:mm A"),
        bookingDate: moment().format("DD/MM/YYYY"),
        customerNumber: table.maxPersons,
        checkIn: true,
        tableId: tableId,
        ofRestaurant: restaurant.restaurantId,
    });

    table.status = "in use";

    await table.save();
    await newBooking.save();

    res.status(200).send({
        message: "Table updated successfully",
    });
});

const closeTable = asyncHandler(async (req, res) => {
    const tableId = req.params.id;
    const table = await tableModel.findOne({ tableId: tableId });

    if (!table) {
        res.status(404);
        throw new Error("Table not found");
    }

    const booking = await bookingModel.findOne({
        tableId: table.tableId
    });

    table.status = "ready";

    await booking.deleteOne();

    await table.save();

    res.status(200).send({
        message: "Table updated successfully",
    });
});

const selectedTable = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOneAndUpdate(
        { bookingId: bookingId },
        { tableId: req.body },
        { new: true }
    );

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Update booking successfully",
        data: booking,
    });
});

const update = {
    updateRestaurant,
    updateProduct,
    checkIn,
    selectedTable,
    order,
    payment,
    updateInfoTable,
    openTable,
    closeTable,
}

export default update;