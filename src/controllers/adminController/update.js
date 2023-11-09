import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import restaurantModel from "../../models/restaurant.model.js";
import menuModel from "../../models/menu.model.js";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const updateRestaurant = asyncHandler(async (req, res) => {
    const { restaurantName, address, openTime, closedTime, description } = req.body;
    const imageFile = req.file;
    const { id } = req.user;

    const restaurant = await restaurantModel.findOne({ createBy: id });

    if (!restaurant) {
        return res.status(404).send({
            message: "Restaurant not found",
        });
    }

    const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "Menu",
    });

    fs.unlinkSync(imageFile.path);

    const imageUrl = imageResult.secure_url;

    restaurant.restaurantName = restaurantName;
    restaurant.address = address;
    restaurant.openTime = openTime;
    restaurant.closedTime = closedTime;
    restaurant.description = description;
    restaurant.imageUrl = imageUrl;
    restaurant.createBy = id;
    await restaurant.save();

    res.status(200).send({
        message: "Restaurant updated successfully",
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
        message: "Update product successfully"
    });
});

const update = {
    updateRestaurant,
    updateProduct,
}

export default update;