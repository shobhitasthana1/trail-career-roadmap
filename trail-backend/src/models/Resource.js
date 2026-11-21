const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      index: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      default: '',
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      default: 'Beginner',
    },
    type: {
      type: String,
      default: 'Docs',
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ category: 1, type: 1 });
resourceSchema.index({ skills: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
