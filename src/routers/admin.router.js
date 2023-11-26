import { Router } from "express";
import adminController from "../controllers/adminController/index.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMdw } from "../middlewares/validate.middleware.js";
import { tableSchema } from "../validations/table.validation.js";

const adminRouter = Router();

// CREATE
adminRouter.post("/restaurant", authMiddleware, upload.single("image"), adminController.create.createRestaurant);
adminRouter.post("/menu", authMiddleware, upload.single("image"), adminController.create.createMenu);
adminRouter.post("/employee", authMiddleware, adminController.create.createEmployee);
adminRouter.post("/table", validationMdw(tableSchema), authMiddleware, adminController.create.createTable);
adminRouter.post("/post", authMiddleware, upload.single("image"), adminController.create.createPost);

// READ
adminRouter.get("/restaurant", authMiddleware, adminController.read.getRestaurants);
adminRouter.get("/restaurant/:id", authMiddleware, adminController.read.getInfoRestaurant);
adminRouter.get("/booking", authMiddleware, adminController.read.getAllBookings);
adminRouter.get("/booking/:id", authMiddleware, adminController.read.getInfoBooking);
adminRouter.get("/menu", authMiddleware, adminController.read.getAllMenus);
adminRouter.get("/menu/:id", authMiddleware, adminController.read.getProduct);
adminRouter.get("/employee", authMiddleware, adminController.read.getAllEmployees);
adminRouter.get("/employee/:id", authMiddleware, adminController.read.getInfoEmployee);
adminRouter.get("/post", authMiddleware, adminController.read.getAllPosts);
adminRouter.get("/post/:id", authMiddleware, adminController.read.getInfoPost);
adminRouter.get("/totals", authMiddleware, adminController.read.getTotals);
adminRouter.get("/table", authMiddleware, adminController.read.getTables);
adminRouter.get("/table/:id", authMiddleware, adminController.read.getInfoTable);

// UPDATE
adminRouter.put("/restaurant/:id", authMiddleware, upload.single("image"), adminController.update.updateRestaurant);
adminRouter.put("/menu/:id", authMiddleware, upload.single("image"), adminController.update.updateProduct);
adminRouter.put("/checkIn/:id", authMiddleware, adminController.update.checkIn);
adminRouter.put("/booking/table/:id", authMiddleware, adminController.update.selectedTable);
adminRouter.put("/booking/order/:id", authMiddleware, adminController.update.order)
adminRouter.put("/booking/payment/:id", authMiddleware, adminController.update.payment);
adminRouter.put("/table/:id", authMiddleware, adminController.update.updateInfoTable);
adminRouter.put("/openTable/:id", authMiddleware, adminController.update.openTable);
adminRouter.put("/closeTable/:id", authMiddleware, adminController.update.closeTable);
adminRouter.put("/post/:id", authMiddleware, upload.single("image"), adminController.update.updatePost);

// DELETE
adminRouter.delete("/restaurant/:id", authMiddleware, adminController.remove.deleteRestaurant);
adminRouter.delete("/menu/:id", authMiddleware, adminController.remove.deleteMenuItem);
adminRouter.delete("/post/:id", authMiddleware, adminController.remove.deletePost);
adminRouter.delete("/booking/:id", authMiddleware, adminController.remove.deleteBooking);
adminRouter.delete("/table/:id", authMiddleware, adminController.remove.deleteTable);

// DELETE ALL
adminRouter.delete("/delete/order", adminController.remove.deleteAllOrders);
adminRouter.delete("/delete/menu", adminController.remove.deleteAllMenus);
adminRouter.delete("/delete/employee", adminController.remove.deleteAllEmployees);
adminRouter.delete("/delete/restaurant", adminController.remove.deleteAllRestaurants);
adminRouter.delete("/delete/post", adminController.remove.deleteAllPosts);
adminRouter.delete("/delete/table", adminController.remove.deletellTables);

// DELETE AUTO
adminRouter.delete("/auto", adminController.remove.deleteExpiredBookings);

export default adminRouter;