const mongoose = require('mongoose')

const nodeSchema = new mongoose.Schema(
    {
        id: String,
        label: String,
        stage: String,
        marketDemand: Number,
        category: String,
        description: String
    },
    {
        _id: false
    }
);

const edgeSchema = new mongoose.Schema(
    {
        id: String,
        source: String,
        target: String,
        type: String
    },
    {
        _id: false
    }
);

