const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dataRoute = require("./routes/Datas.js")
const userRoute = require("./routes/Users.js")

const PORT = process.env.PORT || 8000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true,
  optionsSuccessStatus: 200,
}))
app.use(express.json())




const connection = mongoose.connect(
    process.env.MONGO_DB_ADD,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

connection
  .then((response) => {
    console.log("Database has been connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  }
);


app.use('/api', dataRoute)
app.use('/api', userRoute)

