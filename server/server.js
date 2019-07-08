require("./config/config")
const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.connect(process.env.URLDB = urlDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("base de datos mongo");
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/routes'));


app.listen(process.env.PORT, () => {
    console.log("escuchan por el puerto 3000");
})