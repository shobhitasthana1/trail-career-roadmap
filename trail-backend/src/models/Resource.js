const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['documentation', 'tutorial', 'blog', 'video', 'course'],
      default: 'tutorial',
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ skill: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
