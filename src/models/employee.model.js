import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    employeeId: {
        type: String,
    },
    fullName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
    },
});

const employeeModel = mongoose.model("Employee", employeeSchema);

export default employeeModel;
