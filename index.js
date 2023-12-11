import express from "express";
import "dotenv/config";
import cors from "cors";
import router from "./src/routers/router.js";
import { connectToDatabase } from "./src/config/db.js";
import { errorHandlerMiddleware } from "./src/middlewares/error.middleware.js";
import cron from "node-cron";
import { deleteBookingExpired, updateStatusTable } from "./src/controllers/auto/auto.js";

const app = express();

const whitelist = ["http://localhost:3000",
    "http://localhost:3001",
    "https://restaurant-booking-rosy.vercel.app/",
    "https://admin-dashboard-six-zeta.vercel.app/",
    "https://backend-4edn.onrender.com/"
];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methors: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
// };

var allowlist = ["http://localhost:3000",
    "http://localhost:3001",
    "https://restaurant-booking-rosy.vercel.app/",
    "https://admin-dashboard-six-zeta.vercel.app/",
    "https://backend-4edn.onrender.com/"]

var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

connectToDatabase();

cron.schedule("* * * * * *", async () => {
    // await deleteBookingExpired();
    await updateStatusTable();
});

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT, () => {
    console.log(`Serving on port ${process.env.PORT}`);
});