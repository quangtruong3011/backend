import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";
import employeeModel from "../../models/employee.model.js";
import menuModel from "../../models/menu.model.js";
import generateRandomCode from "../../utils/genderateRandomCode.js";
import tableModel from "../../models/table.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import postModel from "../../models/post.model.js";
import adminModel from "../../models/admin.model.js";
import mongoose from "mongoose";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createRestaurant = asyncHandler(async (req, res) => {
    const { restaurantName, address, province, district, phoneNumber, openTime, closeTime, description } = req.body;
    const imageFile = req.file;

    const { id } = req.user;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const newRestaurant = new restaurantModel({
        restaurantId: crypto.randomUUID(),
        restaurantName: restaurantName,
        province: province,
        district: district,
        address: address,
        phoneNumber: phoneNumber,
        openTime: openTime,
        closeTime: closeTime,
        description: description,
        imageUrl: imageUrl,
        createBy: id,
    });

    await newRestaurant.save();

    res.status(201).send({
        message: "Create restaurant successfully",
    });
});

const createMenu = asyncHandler(async (req, res) => {
    const { productName, category, description, price, unit, discount } = req.body;
    const imageFile = req.file;

    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const newMenuItem = new menuModel({
        productId: crypto.randomUUID(),
        productName: productName,
        category: category,
        unit: unit,
        description: description,
        price: price,
        discount: discount,
        imageUrl: imageUrl,
        createBy: id,
        ofRestaurant: restaurant.restaurantId,
    });

    await newMenuItem.save();

    res.status(201).send({
        message: "Created menu item successfully",
    });
});

const createEmployee = asyncHandler(async (req, res) => {
    const { fullName, gender, phoneNumber, password } = req.body;
    const { id } = req.user;

    const existingEmployee = await employeeModel.findOne({ phoneNumber: phoneNumber });

    if (existingEmployee) {
        res.status(401);
        throw new Error("Employee already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newEmployee = new employeeModel({
        employeeId: await generateRandomCode(),
        fullName,
        gender,
        phoneNumber,
        password: hash,
        createBy: id,
    });

    await newEmployee.save();

    res.status(201).send({
        message: "Create new employee successfully",
    });
});


const createTable = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const { tableName, maxPersons } = req.body;

    const table = await tableModel.find({});

    if (tableName === table.tableName) {
        res.status(401);
        throw new Error("The table already exists");
    }

    const newTable = new tableModel({
        tableId: new mongoose.Types.ObjectId,
        tableName: tableName,
        maxPersons: maxPersons,
        ofRestaurant: restaurant.restaurantId,
    });

    await newTable.save();

    res.status(201).send({
        message: "Create new table successfully",
    });
});

const createPost = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const imageFile = req.file;

    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const newPost = await postModel({
        postId: crypto.randomUUID(),
        content: content,
        imageUrl: imageUrl,
        createBy: id,
        ofRestaurant: restaurant.restaurantId,
    });

    await newPost.save();

    res.status(201).send({
        message: "Create new post successfully"
    });
});

const findBooking = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber } = req.body;

    const booking = await bookingModel.findOne({
        customerName: customerName,
        phoneNumber: phoneNumber,
    });

    if (!booking || booking.length === 0) {
        res.status(404);
        throw new Error("Booking not found");
    }
    
    res.status(200).send({
        message: "Get info booking successfully",
        data: booking,
    });
});


const create = {
    createRestaurant,
    createMenu,
    createEmployee,
    createTable,
    createPost,
}

export default create;