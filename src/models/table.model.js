import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableId: {
        type: String,
    },
    tableName: {
        type: String,
        required: true,
    },
    maxPersons: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["ready", "in use", "reserved"],
        default: "ready",
    },
    ofRestaurant: {
        type: String,
    },
    ofBooking: {
        type: String,
    },
});

const tableModel = mongoose.model("Table", tableSchema);

export default tableModel;