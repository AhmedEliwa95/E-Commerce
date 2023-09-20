const mongoose = require("mongoose");

const dbConnection = () => {
  // MongoDB Connection
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`DB Connected: ${conn.connection.host}`);
    })
    .catch((e) => {
      console.error(`DB Error: ${e}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
