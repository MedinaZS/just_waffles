const mongoose = require('mongoose');

const WaffleSchema = mongoose.Schema({
    quantity: {
        type: String,
        required: [true, "Dough is required"]
    },
    size: {
        type: String,
        required: [true, "Size is required"],
    },
    doughType: {
        type: String,
        required: [true, "Dough is required"]
    },
    toppings: {
        type: [String],
        default : ["None"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },

}, { timestamps: true });

// Export as a schema
module.exports.Waffle = WaffleSchema; 

