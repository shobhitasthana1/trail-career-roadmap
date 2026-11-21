const mongoose = require('mongoose');

const skillDemandSchema = new mongoose.Schema(
  {
    skillName: String,
    slug: String,
    count: Number,       // how many job postings mentioned this skill
    percentage: Number,  // count / totalJobs * 100
  },
  { _id: false }
);

const marketSnapshotSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    totalJobs: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ['adzuna', 'jsearch', 'jooble', 'mixed'],
      default: 'adzuna',
    },
    skills: [skillDemandSchema],
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Fast lookup + keep only the latest per role
marketSnapshotSchema.index({ role: 1, analyzedAt: -1 });

module.exports = mongoose.model('MarketSnapshot', marketSnapshotSchema);
