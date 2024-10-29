import app from "./app";
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
process.on(uncaughtException, (err) => {
  console.log(err);
  process.exit(1);
});
const server = http.createServer(app);
const db = process.env.DBURI.replace("<PASSWORD>", process.env.DBPASSWORD);
const PORT = process.env.PORT || 3000;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connect database is succesful");
  })
  .catch((err) => {
    console.log(err);
  });
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on(unhandledRejection, (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
