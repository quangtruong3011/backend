import { Router } from "express";
import authAdminController from "../controllers/authController/auth.admin.controller.js";
import authEmployeeController from "../controllers/authController/auth.employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

// ADMIN
authRouter.post("/admin/login", authAdminController.login);
authRouter.post("/admin/register", authAdminController.register);
authRouter.get("/admin/getInfo", authMiddleware, authAdminController.getInfo);

// EMPLOYEE
authRouter.post("/employee/login", authEmployeeController.login);
authRouter.get("/employee/getInfo", authMiddleware, authEmployeeController.getInfo);

// USER


export default authRouter;