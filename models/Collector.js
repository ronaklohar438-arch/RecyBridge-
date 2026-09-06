const mongoose = require("mongoose");

const collectorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    area: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Collector", collectorSchema);