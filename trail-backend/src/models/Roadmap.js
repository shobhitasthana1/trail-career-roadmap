const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    stage: String,
    marketDemand: mongoose.Schema.Types.Mixed,
    category: String,
    description: String,
  },
  {
    _id: false,
  }
);

const edgeSchema = new mongoose.Schema(
  {
    id: String,
    source: String,
    target: String,
    type: {
      type: String,
      default: 'smoothstep',
    },
  },
  {
    _id: false,
  }
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
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ['prebuilt', 'market-generated', 'verified'],
      default: 'market-generated',
    },
    description: {
      type: String,
      default: '',
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    totalJobs: {
      type: Number,
      default: 0,
    },
    totalSkills: {
      type: Number,
      default: 0,
    },
    marketDemandAvg: {
      type: String,
      default: '',
    },
    gradient: {
      type: String,
      default: '',
    },
    topSkills: {
      type: [String],
      default: [],
    },
    marketAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
