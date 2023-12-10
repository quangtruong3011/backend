import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import restaurantModel from "../../models/restaurant.model.js";
import menuModel from "../../models/menu.model.js";
import bookingModel from "../../models/booking.model.js";
import postModel from "../../models/post.model.js";
import tableModel from "../../models/table.model.js";
import moment from "moment";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const updateRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const { restaurantName, province, district, ward, address, openTime, closeTime, description } = req.body;
    const imageFile = req.file;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const restaurant = await restaurantModel.updateOne({ createBy: id }, {
        restaurantName: restaurantName,
        province: province,
        district: district,
        ward: ward,
        address: address,
        openTime: openTime,
        closeTime: closeTime,
        description: description,
        imageUrl: imageUrl,
    });

    res.status(200).send({
        message: "Restaurant updated successfully",
        data: restaurant,
    });
});


const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const imageFile = req.file;

    const product = await menuModel.findOne({ productId: productId });

    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    product.productName = req.body.productName;
    product.category = req.body.category;
    product.description = req.body.description;
    product.unit = req.body.unit;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.imageUrl = imageUrl;

    await product.save();

    res.status(201).send({
        message: "Update product successfully",
        data: product,
    });
});

const checkIn = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const updateBooking = await bookingModel.findOneAndUpdate(
        { bookingId: bookingId },
        { checkIn: true },
        { new: true }
    );

    if (!updateBooking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Update booking successfully",
        booking: updateBooking,
    });
});

const order = asyncHandler(async (req, res) => {
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId });

    if (!booking) {
        res.status(404).send("Booking not found");
        return;
    }

    const newMenu = req.body;

    newMenu.forEach(item => {
        const existingMenuIndex = booking.menu.findIndex(i => i.productId === item.productId);
        if (existingMenuIndex !== -1) {
            booking.menu[existingMenuIndex].quantity += item.quantity;
        } else {
            booking.menu.push(item);
        }
    });

    await booking.save();

    res.status(200).send({
        message: "Booking updated successfully",
        data: booking.menu,
    });
});

const selectedTable = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const tables = await tableModel.find({ restaurant: restaurant.restaurantId });
    const bookingId = req.params.id;

    const booking = await bookingModel.findOneAndUpdate(
        { bookingId: bookingId },
        { table: req.body },
        { new: true }
    );

    tables.forEach(table => {
        booking.table.forEach(item => {
            if (item == table.tableId) {
                let infoBooking = {
                    bookingDate: booking.bookingDate,
                    bookingTime: booking.bookingTime,
                    endTime: moment().add(12, "hours"),
                    booking: booking.bookingId,
                }
                table.info.push(infoBooking);
                table.save();
            }
        })
    });

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    res.status(200).send({
        message: "Update booking successfully",
        data: booking,
    });
});

const pay = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const bookingId = req.params.id;

    const booking = await bookingModel.findOne({ bookingId: bookingId });
    const tables = await tableModel.find({ restaurant: restaurant.restaurantId });

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    const updateBooking = await bookingModel.findOneAndUpdate(
        { bookingId: bookingId },
        {
            active: false,
            total: req.body.total,
        },
        { new: true }
    );

    tables.forEach(table => {
        booking.table.forEach(item => {
            if (item == table.tableId) {
                table.info.map(info => {
                    info.endTime = moment();
                });
                table.status = "ready";
                table.save();
            }
        });
    });

    res.status(200).send({
        message: "Update booking successfully",
        data: updateBooking,
    });
});

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const postId = req.params.id;
    const post = await postModel.findOne({ postId: postId, ofRestaurant: restaurant.restaurantId });

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    const imageFile = req.file;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const updatePost = await postModel.findOneAndUpdate(
        { postId: postId },
        {
            title: req.body.title,
            content: req.body.content,
            imageUrl: imageUrl,
        },
        { new: true }
    );

    res.status(200).send({
        message: "Update post successfully",
        data: updatePost,
    });
});

const updateAvatar = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const imageFile = req.file;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Avatar",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const updateAdmin = await restaurantModel.findOneAndUpdate(
        { _id: id },
        { avatar: imageUrl },
        { new: true }
    );

    res.status(200).send({
        message: "Update avatar successfully",
        data: updateAdmin.avatar,
    });
});

const updateCover = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const imageFile = req.file;

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Cover",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    const updateAdmin = await restaurantModel.findOneAndUpdate(
        { _id: id },
        { coverPhoto: imageUrl },
        { new: true }
    );

    res.status(200).send({
        message: "Update cover successfully",
        data: updateAdmin.cover,
    });
});

const updateTable = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const restaurant = await restaurantModel.findOne({ createBy: id });
    const tableId = req.params.id;
    const table = await tableModel.findOne({ tableId: tableId, restaurant: restaurant.restaurantId });

    if (!table) {
        res.status(404);
        throw new Error("Table not found");
    }

    const updateTable = await tableModel.findOneAndUpdate(
        { tableId: tableId },
        {
            tableName: req.body.tableName,
            capacity: req.body.capacity
        },
        { new: true }
    );

    res.status(200).send({
        message: "Update table successfully",
        data: updateTable
    });
});


const update = {
    updateRestaurant,
    updateProduct,
    checkIn,
    selectedTable,
    order,
    pay,
    updatePost,
    updateAvatar,
    updateCover,
    updateTable,
}

export default update;