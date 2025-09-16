const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();
dotenv.config({ path: "config.env" }); // load first ✅

const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${NODE_ENV}`);
}

app.get("/hello-again", (req, res) => {
  res.send("hello, world");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("NODE_ENV is:", NODE_ENV);

  console.log(`server is running on port ${PORT}`);
});
