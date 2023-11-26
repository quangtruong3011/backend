import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./src/routers/router.js";
import { connectToDatabase } from "./src/config/db.js";
import { errorHandlerMiddleware } from "./src/middlewares/error.middleware.js";

const app = express();

const whitelist = ["https://admin-dasboard.onrender.com", "https://backend-mkzl.onrender.com/"];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

connectToDatabase();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", router);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
});