import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableId: {
        type: String,
    },
    name: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["ready", "in use", "reserved"],
        default: "ready",
    },
});

const tableModel = mongoose.model("Table", tableSchema);

export default tableModel;