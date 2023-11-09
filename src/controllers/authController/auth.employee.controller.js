import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import employeeModel from "../../models/employee.model.js";
import "dotenv/config";

const login = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;

    const employee = await employeeModel.findOne({ phoneNumber: phoneNumber });

    if (!employee) {
        res.status(401);
        throw new Error("Phone number or password is not correct");
    }

    const isMatchPassword = await bcrypt.compare(password, employee.password);

    if (!isMatchPassword) {
        res.status(401);
        throw new Error("Phone number or password is not correct");
    }

    const jwtPayload = {
        id: employee.id,
        phoneNumber: employee.phoneNumber,
        password: employee.password,
    };

    const accessToken = jwt.sign(jwtPayload, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });

    res.send({
        message: "Login successfully",
        accessToken: accessToken,
    });
});

const getInfo = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const currentEmployee = await employeeModel.findById(id).select("-password");

    if (!currentEmployee) {
        res.status(401);
        throw new Error("Unauthorized");
    }

    res.send({
        user: currentEmployee,
    })
});

const authEmployeeController = {
    login,
    getInfo,
}

export default authEmployeeController;