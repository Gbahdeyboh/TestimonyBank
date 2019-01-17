const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        default: '',
        unique: true
    },
    number: {
        type: Number,
        trim: true,
        default: 0,
    },
    password: {
        type: Object,
        required: true,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', userSchema);