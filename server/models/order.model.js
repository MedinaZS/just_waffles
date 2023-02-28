const mongoose = require('mongoose');
const { Waffle } = require('./waffle.model'); //Import schema

const OrderSchema = mongoose.Schema({
    method: {
        type: String,
        required: [true, "Method is required"],
    },
    waffles: [Waffle],
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required"],
    },
    date: {
        type: String,
        default: ""
    },
    favorite: {
        type: Boolean,
        default: false
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"]
    },

}, { timestamps: true });

module.exports.Order = mongoose.model("Order", OrderSchema);

