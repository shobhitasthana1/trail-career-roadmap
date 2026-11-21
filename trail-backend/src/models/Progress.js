const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema(
  {
    skillId: String, // matches node id in the roadmap
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true,
    },
    skills: [skillProgressSchema],
    // calculated by the backend, never accepted from the frontend
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// One progress record per user per roadmap
progressSchema.index({ user: 1, roadmap: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
