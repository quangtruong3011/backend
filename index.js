import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./src/routers/router.js";
import { connectToDatabase } from "./src/config/db.js";
import { errorHandlerMiddleware } from "./src/middlewares/error.middleware.js";
import cron from "node-cron";
import { updateStatusTable } from "./src/controllers/auto/auto.js";

const app = express();

const whitelist = ["http://localhost:3000",
    "http://localhost:3001",
    "https://restaurant-booking-rosy.vercel.app/",
    "https://admin-dashboard-six-zeta.vercel.app/",
    "https://backend-4edn.onrender.com/"
];

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

cron.schedule("* * * * * *", async () => {
    await updateStatusTable();
});

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", router);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
});