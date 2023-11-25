import { Router } from "express";
import UserController from "../controllers/userController/index.js";

const userRouter = Router();

// CREATE
userRouter.post("/booking", UserController.create.booking);
userRouter.post("/searchByProvince", UserController.create.getRestaurantsByProvince);
userRouter.post("/searchByName", UserController.create.getRestaurantByName);

// READ
userRouter.get("/restaurant", UserController.read.getAllRestaurants);
userRouter.get("/restaurant/:id", UserController.read.getInfoRestaurant);
userRouter.get("/restaurant/image/:id", UserController.read.getImageRestaurant);
userRouter.get("/menu/:id", UserController.read.getAllMenus);
userRouter.get("/booking", UserController.read.getBookings);
userRouter.get("/booking/:id", UserController.read.getInfoBooking);
userRouter.get("/suggest/:id", UserController.read.getSuggestRestaurants);

// UPDATE
userRouter.put("/booking/:id", UserController.update.updateBooking);

// DELETE
userRouter.delete("/booking/:id", UserController.remove.deleteBooking);

export default userRouter;