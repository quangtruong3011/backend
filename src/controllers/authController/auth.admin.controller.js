import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import adminModel from "../../models/admin.model.js";
import mongoose from "mongoose";
import restaurantModel from "../../models/restaurant.model.js";

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email: email });

    if (!admin) {
        res.status(401);
        throw new Error("Email or password is not correct");
    }

    const isMatchPassword = await bcrypt.compare(password, admin.password);

    if (!isMatchPassword) {
        res.status(401);
        throw new Error("Email or password is not correct");
    }

    await admin.save();

    const jwtPayload = {
        id: admin.id,
        email: admin.email,
        password: admin.password,
    }

    const accessToken = jwt.sign(jwtPayload, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });

    res.send({
        message: "Login successfully",
        accessToken: accessToken,
    });
});

const register = asyncHandler(async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email: email, phoneNumber: phoneNumber });

    if (existingAdmin) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
        adminId: new mongoose.Types.ObjectId,
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    const newRestaurant = await restaurantModel.create({
        restaurantName: "",
        province: 0,
        district: 0,
        ward: 0,
        address: "",
        openTime: "",
        closeTime: "",
        description: "",
        imageUrl: "",
        createBy: newAdmin._id,
    })

    await newAdmin.save();

    await newRestaurant.save();

    res.status(201).send({
        message: "Register successfully"
    });
});

const getInfo = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const currentAdmin = await adminModel.findById(id).select("-password");

    if (!currentAdmin) {
        res.status(401);
        throw new Error("Unauthorized user");
    }

    res.send({ user: currentAdmin });
});

const authAdminController = {
    login,
    register,
    getInfo
}

export default authAdminController;