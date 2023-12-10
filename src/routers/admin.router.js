import { Router } from "express";
import adminController from "../controllers/adminController/index.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const adminRouter = Router();

// CREATE
adminRouter.post("/restaurant", authMiddleware, upload.single("image"), adminController.create.createRestaurant);
adminRouter.post("/menu", authMiddleware, upload.single("image"), adminController.create.createMenu);
adminRouter.post("/menu/category", authMiddleware, upload.single("image"), adminController.create.getProductCategory);
adminRouter.post("/employee", authMiddleware, adminController.create.createEmployee);
adminRouter.post("/table", authMiddleware, adminController.create.createTable);
adminRouter.post("/post", authMiddleware, upload.single("image"), adminController.create.createPost);
adminRouter.post("/booking", authMiddleware, adminController.create.createBooking);
adminRouter.post("/findBooking", authMiddleware, adminController.create.findBooking);

// READ
adminRouter.get("/info", authMiddleware, adminController.read.getInfo);
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
adminRouter.get("/tableReady", authMiddleware, adminController.read.getTableReady);
adminRouter.get("/ready", authMiddleware, adminController.read.findTableReady);

// UPDATE
adminRouter.put("/restaurant", authMiddleware, upload.single("image"), adminController.update.updateRestaurant);
adminRouter.put("/menu/:id", authMiddleware, upload.single("image"), adminController.update.updateProduct);
adminRouter.put("/booking/checkIn/:id", authMiddleware, adminController.update.checkIn);
adminRouter.put("/booking/table/:id", authMiddleware, adminController.update.selectedTable);
adminRouter.put("/booking/order/:id", authMiddleware, adminController.update.order)
adminRouter.put("/booking/pay/:id", authMiddleware, adminController.update.pay);
adminRouter.put("/post/:id", authMiddleware, upload.single("image"), adminController.update.updatePost);
adminRouter.put("/profile/avatar", authMiddleware, upload.single("avatar"), adminController.update.updateAvatar);
adminRouter.put("/profile/cover", authMiddleware, upload.single("cover"), adminController.update.updateCover);
adminRouter.put("/table/:id", authMiddleware, adminController.update.updateTable);

// DELETE
adminRouter.delete("/restaurant/:id", authMiddleware, adminController.remove.deleteRestaurant);
adminRouter.delete("/menu/:id", authMiddleware, adminController.remove.deleteMenuItem);
adminRouter.delete("/post/:id", authMiddleware, adminController.remove.deletePost);
adminRouter.delete("/booking/:id", authMiddleware, adminController.remove.deleteBooking);
adminRouter.delete("/table/:id", authMiddleware, adminController.remove.deleteTable);
adminRouter.delete("/employee/:id", authMiddleware, adminController.remove.deleteEmployee);

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