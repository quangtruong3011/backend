import moment from "moment";

const data = {
  "_id": {
    "$oid": "656dafb5ce0866e5a12fa1d8"
  },
  "tableId": {
    "$oid": "656dafb5ce0866e5a12fa1d7"
  },
  "tableName": "Bàn 4",
  "capacity": 12,
  "status": "in use",
  "restaurant": [
    {
      "$oid": "6569f568e4f9bb2cd524abd3"
    }
  ],
  "info": [
    {
      "bookingDate": {
        "$date": "2023-12-10T07:05:54.253Z"
      },
      "bookingTime": {
        "$date": "2023-12-10T07:06:00.000Z"
      },
      "booking": {
        "$oid": "6575635f96a503b87ef4a698"
      },
      "_id": {
        "$oid": "6575636696a503b87ef4a6d2"
      },
      "endTime": {
        "$date": "2023-12-10T07:07:05.233Z"
      }
    }
  ],
  "__v": 5
}

const endTime = moment().isAfter(moment(data.info.map(info => info.endTime.$date)));

console.log(endTime);