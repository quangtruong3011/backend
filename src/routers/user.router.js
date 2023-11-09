import { Router } from "express";
import UserController from "../controllers/userController/index.js";

const userRouter = Router();

// CREATE
userRouter.post("/booking", UserController.create.Booking);

// READ
userRouter.get("/restaurant", UserController.read.getAllRestaurant);
userRouter.get("/restaurant/:id", UserController.read.getInfoRestaurant);
userRouter.get("/restaurant/image/:id", UserController.read.getImageRestaurant);
userRouter.get("/menu/:id", UserController.read.getAllMenu);

export default userRouter;