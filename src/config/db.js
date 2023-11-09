import mongoose from "mongoose";
import "dotenv/config";

export const connectToDatabase = async () => {
    try {
        const connetion = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database is connected at ${connetion.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

