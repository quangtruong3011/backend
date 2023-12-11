import bookingModel from "../../models/booking.model.js";
import tableModel from "../../models/table.model.js";
import moment from "moment";

export const deleteBookingExpired = async () => {
    const bookings = await bookingModel.find({});
    const limit = 30;
    for (const booking of bookings) {
        const bookingDate = moment(booking.bookingDate).format("DD/MM/YYYY");
        const bookingTime = moment(booking.bookingTime).format("HH:mm:ss");
        const bookingDateTime = moment(bookingDate + "T" + bookingTime);
        const diff = moment().diff(bookingDateTime, "minutes");
        if (diff > limit) {
            await bookingModel.deleteOne({ bookingId: booking.bookingId });
        }
    }
};

export const updateStatusTable = async () => {
    try {
        const tables = await tableModel.find({});

        tables.forEach(table => {
            table.info.forEach(info => {
                const bookingDate = moment(info.bookingDate).format("YYYY-MM-DD");
                const bookingTime = moment(info.bookingTime).format("HH:mm:ss");
                const bookingDateTime = moment(bookingDate + "T" + bookingTime);
                const endTime = moment(info.endTime);

                if (moment().isBetween(bookingDateTime, endTime)) {
                    table.status = "in use";
                } else if (endTime) {
                    table.status = "ready";
                }
            });
        });

        await Promise.all(tables.map(table => table.save()));
    } catch (error) {
        console.log(error);
    }
};
