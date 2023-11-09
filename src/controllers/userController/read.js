import asyncHandler from "express-async-handler";
import restaurantModel from "../../models/restaurant.model.js";
import menuModel from "../../models/menu.model.js";
import postModel from "../../models/post.model.js";

const getAllRestaurant = asyncHandler(async (req, res) => {
    const allRestaurants = await restaurantModel.find({});

    res.status(200).send({
        message: "Get all restaurant successfully",
        data: allRestaurants,
    });
});

const getInfoRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const restaurantInfo = await restaurantModel.findOne({ restaurantId: restaurantId });

    res.status(200).send({
        message: "Get info restaurant successfully",
        data: restaurantInfo,
    });
});

const getAllMenu = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const allMenus = await menuModel.find({ ofRestaurant: restaurantId });

    res.status(200).send({
        message: "Get all menu successfully",
        data: allMenus,
    });
});

const getImageRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.id;

    const posts = await postModel.find({ ofRestaurant: restaurantId }, "imageUrl");
    const imageUrls = posts.map((post) => post.imageUrl);

    res.status(200).send({
        message: "Get image restaurant successfully",
        data: imageUrls,
    });
});

const read = {
    getAllRestaurant,
    getInfoRestaurant,
    getAllMenu,
    getImageRestaurant,
}

export default read;