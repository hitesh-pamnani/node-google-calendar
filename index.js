const express = require("express");
const router = require("./routes");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(8080, () => {
  console.log("App running on 8080");
});
