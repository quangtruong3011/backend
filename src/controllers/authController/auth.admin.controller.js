import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import crypto from "crypto";
import "dotenv/config";
import jwt from "jsonwebtoken";
import adminModel from "../../models/admin.model.js";

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

    admin.loginTime = new Date();
    await admin.save();

    const jwtPayload = {
        id: admin.id,
        email: admin.email,
        password: admin.password,
    }

    const accessToken = jwt.sign(jwtPayload, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });

    res.send({
        message: "Login successfully",
        accessToken: accessToken,
    });
});

const register = asyncHandler(async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    const existingAdmin = await adminModel.findOne({ email: email });

    if (existingAdmin) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({
        adminId: crypto.randomUUID(),
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    await newAdmin.save();

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