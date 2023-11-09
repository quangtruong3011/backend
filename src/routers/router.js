import { Router } from "express";
import authRouter from "./auth.router.js";
import adminRouter from "./admin.router.js";
import employeeRouter from "./employee.router.js";
import userRouter from "./user.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/employee", employeeRouter);
router.use("/user", userRouter);

export default router;