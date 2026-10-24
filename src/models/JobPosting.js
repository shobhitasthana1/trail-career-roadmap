const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: ['adzuna', 'jsearch', 'jooble'],
      required: true,
    },
    role: {
      // normalized search term e.g. "backend developer"
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: String,
    company: String,
    location: String,
    description: String,
    url: String,
    postedAt: Date,
    extractedSkills: [String], // filled after LLM extraction
    isProcessed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate postings from same source
jobPostingSchema.index({ externalId: 1, source: 1 }, { unique: true });
// Fast lookup by role
jobPostingSchema.index({ role: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
