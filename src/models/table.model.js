import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableId: {
        type: mongoose.Types.ObjectId,
        auto: true,
    },
    tableName: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["ready", "in use", "reserved"],
        default: "ready",
    },
    info: [
        {
            bookingDate: {
                type: Date,
            },
            bookingTime: {
                type: Date,
            },
            endTime: {
                type: Date,
            },
            booking: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        }
    ],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },

});

const tableModel = mongoose.model("Table", tableSchema);

export default tableModel;