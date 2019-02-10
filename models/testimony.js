const mongoose = require('mongoose');

const TestimoniesSchema = new mongoose.Schema({
    postersId: {
        required: true,
        type: String,
        trim: true,
        default: ''
    },
    postersName: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    title: {
        required: true,
        type: String,
        trim: true,
        default: ''
    },
    testimony : {
        type: String,
        required: true,
        trim: true,
    },
    datePosted: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        tupe: String,
        default: '' /*To be later filled with the default image url*/
    },
    likes: {
        type: Array,
        default: 0,
        trim: true
    },
    comments: {
        type: Array,
        trim: true
    },
    shares: {
        type: Number,
        default: 0,
        trim: true
    }
});

module.exports = new mongoose.model('Testimonies', TestimoniesSchema);