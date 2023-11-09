import { Router } from "express";
import adminController from "../controllers/adminController/index.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

// CREATE
adminRouter.post("/restaurant", adminController.create.createRestaurant);
adminRouter.post("/menu", authMiddleware, upload.single("image"), adminController.create.createMenu);
adminRouter.post("/employee", authMiddleware, adminController.create.createEmployee);
adminRouter.post("/table", authMiddleware, adminController.create.createTable);
adminRouter.post("/post", authMiddleware, upload.single("image"), adminController.create.createPost);

// READ
adminRouter.get("/restaurant", authMiddleware, adminController.read.getRestaurant);
adminRouter.get("/order", authMiddleware, adminController.read.getAllOrders);
adminRouter.get("/menu", authMiddleware, adminController.read.getAllMenus);
adminRouter.get("/menu/:id", authMiddleware, adminController.read.getProduct);
adminRouter.get("/employee", authMiddleware, adminController.read.getAllEmployees);
adminRouter.get("/post", authMiddleware, adminController.read.getAllPosts);
adminRouter.get("/totals", authMiddleware, adminController.read.getTotals);

// UPDATE
adminRouter.put("/restaurant", authMiddleware, upload.single("image"), adminController.update.updateRestaurant);
adminRouter.put("/menu/:id", authMiddleware, upload.single("image"), adminController.update.updateProduct);

// DELETE
adminRouter.delete("/menu/:id", authMiddleware, adminController.remove.deleteMenuItem);

// DELETE ALL
adminRouter.delete("/post/:id", authMiddleware, adminController.remove.deletePost);
adminRouter.delete("/delete/order", adminController.remove.deleteAllOrders);
adminRouter.delete("/delete/menu", adminController.remove.deleteAllMenus);
adminRouter.delete("/delete/employee", adminController.remove.deleteAllEmployees);
adminRouter.delete("/delete/restaurant", adminController.remove.deleteAllRestaurants);
export default adminRouter;