const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schemaUser = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

let User = mongoose.model('User', schemaUser);
module.exports = User;

