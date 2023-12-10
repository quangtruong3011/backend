import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";
import employeeModel from "../../models/employee.model.js";
import menuModel from "../../models/menu.model.js";
import generateRandomCode from "../../utils/genderateRandomCode.js";
import tableModel from "../../models/table.model.js";
import restaurantModel from "../../models/restaurant.model.js";
import postModel from "../../models/post.model.js";
import bookingModel from "../../models/booking.model.js";
import moment from "moment";


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createRestaurant = asyncHandler(async (req, res) => {
    const { restaurantName, address, province, district, ward, phoneNumber, openTime, closeTime, description } = req.body;
    const imageFile = req.file;

    const { id } = req.user;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const newRestaurant = new restaurantModel({
        restaurantName: restaurantName,
        province: province,
        district: district,
        ward: ward,
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
        productName: productName,
        category: category,
        unit: unit,
        description: description,
        price: price,
        discount: discount,
        imageUrl: imageUrl,
        createBy: id,
        restaurant: restaurant.restaurantId,
    });

    await newMenuItem.save();

    res.status(201).send({
        message: "Created menu item successfully",
        data: newMenuItem,
    });
});

const getProductCategory = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { value } = req.body;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const menuItems = await menuModel.find({ restaurant: restaurant.restaurantId });

    if (value === "1") {
        res.status(200).send({
            message: "Get product category successfully",
            data: menuItems
        });
    } else if (value === "2") {
        const food = menuItems.filter((item) => item.category === "food");
        res.status(200).send({
            message: "Get product category successfully",
            data: food
        });
    } else if (value === "3") {
        const drinks = menuItems.filter((item) => item.category === "drinks");
        res.status(200).send({
            message: "Get product category successfully",
            data: drinks
        });
    }
});

const createEmployee = asyncHandler(async (req, res) => {
    const { fullName, gender, username, password } = req.body;
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ createBy: id });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newEmployee = new employeeModel({
        employeeId: await generateRandomCode(),
        fullName,
        gender,
        username,
        password: hash,
        createBy: id,
        restaurant: restaurant.restaurantId,
    });

    await newEmployee.save();

    res.status(201).send({
        message: "Create new employee successfully",
        data: newEmployee,
    });
});

const createTable = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });

    const { tableName, capacity } = req.body;

    const newTable = new tableModel({
        tableName: tableName,
        capacity: capacity,
        restaurant: restaurant.restaurantId,
    });

    await newTable.save();

    res.status(201).send({
        message: "Create new table successfully",
        data: newTable
    });
});

const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
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
        title: title,
        content: content,
        imageUrl: imageUrl,
        createBy: id,
        ofRestaurant: restaurant.restaurantId,
    });

    await newPost.save();

    res.status(201).send({
        message: "Create new post successfully",
        data: newPost,
    });
});

const createBooking = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber, customerNumber, table, menu } = req.body;
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ createBy: id });
    const allTables = await tableModel.find({ restaurant: restaurant.restaurantId });

    const newBooking = new bookingModel({
        customerName: customerName,
        phoneNumber: phoneNumber,
        customerNumber: customerNumber,
        bookingDate: moment(),
        bookingTime: moment(),
        menu: menu,
        table: table,
        createBy: id,
        checkIn: true,
        restaurant: restaurant.restaurantId,
    });

    allTables.forEach((table) => {
        req.body.table.forEach((item) => {
            if (item == table.tableId) {
                let infoBooking = {
                    bookingDate: newBooking.bookingDate,
                    bookingTime: newBooking.bookingTime,
                    endTime: moment().add(12, "hours"),
                }
                table.info.push(infoBooking);
                table.save();
            }
        })
    });

    await newBooking.save();

    res.status(201).send({
        message: "Create new booking successfully",
        data: newBooking,
    });
});


const findBooking = asyncHandler(async (req, res) => {
    const { customerName, phoneNumber } = req.body;

    const booking = await bookingModel.find({
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
    getProductCategory,
    createEmployee,
    createTable,
    createPost,
    createBooking,
    findBooking,
}

export default create;