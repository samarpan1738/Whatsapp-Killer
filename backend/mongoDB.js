const mongoose = require("mongoose");
const DB_URI = "mongodb://localhost:27017/whatsapp";

function connect() {
  return mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
function getDb() {
  return mongoose.connection;
}

// db.on("error", (err) => {
//   console.error(err);
// });

module.exports = {
  connect,
  getDb,
};
