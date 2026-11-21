// require('mongoose') imports the Mongoose library. 
// Mongoose helps Node.js interact with MongoDB.
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
    {
        name: {
            // display name of the skill
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            // url-safe name of the skill
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        aliases: {
            // other names for the same skill
            type: [String],
            default: []
        },
        category: {
            // classification of skills into category
            type: String,
            enum: [
                'language',
                'library',
                'framework',
                'runtime',
                'database',
                'tool',
                'concept',
                'cloud',
                'other'
            ],
            default: 'other'
        },
        // description of the skill
        description: String
    },
    { timestamps: true}
)

module.exports = mongoose.model('Skill', skillSchema);