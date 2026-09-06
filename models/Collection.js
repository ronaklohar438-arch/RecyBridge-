const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true
    },

    weight: {
        type: Number,
        required: true
    },

    value: {
        type: Number,
        required: true
    },

    // Collector Details
    collector: {
        collectorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collector",
            default: null
        },
        name: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        area: {
            type: String,
            default: null
        }
    },

    pickupLocation: {
        type: String,
        required: true
    },

    contactNumber: {
        type: String,
        required: true
    },

    pickupDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Picked Up",
            "Completed",
            "Rejected"
        ],
        default: "Pending"
    },

    statusHistory: [
        {
            status: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],

    photo: {
        type: String,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Collection", collectionSchema);