import * as Yup from "yup";

export const bookingSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer name is required."),
    phoneNumber: Yup.number().required("Phone number is required."),
    bookingDate: Yup.date().required("Booking date is required."),
    bookingTime: Yup.date().required("Booking time is required."),
    customerNumber: Yup.number().required("Customer number is required."),
    note: Yup.string(),
});