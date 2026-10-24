const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    id: String,        // e.g. "javascript"
    label: String,     // e.g. "JavaScript"
    stage: String,     // e.g. "Foundation"
    marketDemand: Number, // 0–100
    category: String,
    description: String,
  },
  { _id: false }
);

const edgeSchema = new mongoose.Schema(
  {
    id: String,        // e.g. "javascript-nodejs"
    source: String,    // node id
    target: String,    // node id
    type: String,      // "prerequisite" | "related" | "optional"
  },
  { _id: false }
);

const roadmapSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['prebuilt', 'market-generated'],
      required: true,
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    totalJobs: {
      type: Number,
      default: 0,
    },
    marketAnalyzedAt: Date,
  },
  { timestamps: true }
);

roadmapSchema.index({ slug: 1 });

module.exports = mongoose.model('Roadmap', roadmapSchema);
