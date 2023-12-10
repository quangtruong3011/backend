import bookingModel from "../../models/booking.model.js";
import tableModel from "../../models/table.model.js";
import moment from "moment";

export const deleteBookingExpired = async () => {
    const currentDate = new Date();
    const thirtyMinutesAgo = new Date(currentDate.getTime() - 30 * 60 * 1000);
    const currentDay = currentDate.toISOString().split("T")[0];
    try {
        const bookingToDelete = await bookingModel.find({
            checkIn: false,
            bookingTime: {
                $lt: thirtyMinutesAgo.toISOString(),
            },
            bookingDate: currentDay
        });
        await bookingModel.deleteMany({
            _id: {
                $in: bookingToDelete.map((booking) => booking._id),
            },
        })
    } catch (error) {
        console.log(error);
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
