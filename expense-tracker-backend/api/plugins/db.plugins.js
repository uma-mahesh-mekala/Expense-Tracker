const mongoose = require("mongoose");
module.exports = async (fastify) => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/expensestracker")
    .then(() => console.log("successfully connected to DB"))
    .catch((err) => console.log(err));
};
