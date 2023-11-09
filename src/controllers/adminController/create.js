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

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createRestaurant = asyncHandler(async (req, res) => {
    const admin = await adminModel.findOne({ _id: req.user });

    const timeDifference = admin.loginTime.getTime() - admin.loginFirstTime.getTime();

    if (timeDifference < 1000) {
        const newRestaurant = new restaurantModel({
            restaurantId: crypto.randomUUID(),
            restaurantName: "",
            address: "",
            openTime: "",
            closedTime: "",
            description: "",
            imageUrl: "",
        });

        await newRestaurant.save();

        res.status(201).send({
            message: "Create restaurant successfully",
        });
    } else {
        res.status(400).send({
            message: "Cannot create restaurant",
        });
    }
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
    });

    await newEmployee.save();

    res.status(201).send({
        message: "Create new employee successfully",
    });
});

const createTable = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const table = await tableModel.findOne({ name: name });

    if (table) {
        res.status(401);
        throw new Error("The table already exists");
    }

    const newTable = new tableModel({
        tableId: crypto.randomUUID(),
        name: name,
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

const create = {
    createRestaurant,
    createMenu,
    createEmployee,
    createTable,
    createPost,
}

export default create;