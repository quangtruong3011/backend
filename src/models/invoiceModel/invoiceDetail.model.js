import mongoose, { Schema } from "mongoose";

const detailSchema = new mongoose.Schema({
    invoice: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
    },
    itemName: {
        type: String,
    },
    quanity: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    total: {
        type: Number,
    }
});

const invoiceDetailModel = mongoose.model("InvoiceDetail", detailSchema);

export default invoiceDetailModel;