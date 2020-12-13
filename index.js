require("dotenv").config();
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
let mongoose = require("mongoose");
import router from './src/Crawler'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
try {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
        if (error) {
            console.log(error);
        } else {
    
            console.log("Connected to DB");
        }
    });
} catch (error) {
    handleError(error);
}
app.use('/', router)
app.listen(process.env.port, () => {
    console.log(`Example app listening at http://localhost:${process.env.port}`)
})