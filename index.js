require("dotenv").config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
let mongoose = require("mongoose");
let cors = require('cors')
app.use(cors())
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
import router from './src/Server'
app.use('/a', router)
app.use('/', (req,res)=>{
    res.send('hello')
})



app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
