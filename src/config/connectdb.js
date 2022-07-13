const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// connnect mongoose 
function fnConnect() {
    try {
        mongoose.connect(process.env.URL_MONGOOSE, (err, data) => {
            console.log('connected database');
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = fnConnect;