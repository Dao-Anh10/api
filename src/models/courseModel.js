const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schemaCourse = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

let Course = mongoose.model('Course', schemaCourse);
module.exports = Course;

