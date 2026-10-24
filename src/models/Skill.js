const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      // canonical display name e.g. "Node.js"
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      // url-safe identifier e.g. "nodejs"
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    aliases: {
      // other names that map to this skill e.g. ["Node", "NodeJS", "Node JS"]
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: [
        'language',
        'framework',
        'library',
        'database',
        'tool',
        'concept',
        'cloud',
        'other',
      ],
      default: 'other',
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
