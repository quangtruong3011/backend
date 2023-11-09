import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    tableNumber: {
        type: Number,
    },
    discountAmount: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    paidDate: {
        type: Date,
        default: Date.now(),
    },
    paidMethod: {
        type: String,
        enum: ["Bank Transfer", "Cash"],
    },
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

export default invoiceModel;