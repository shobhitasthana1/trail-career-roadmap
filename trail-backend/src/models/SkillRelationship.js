const mongoose = require('mongoose');

const skillRelationshipSchema = new mongoose.Schema(
  {
    fromSkill: {
      // the prerequisite
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    toSkill: {
      // the skill that depends on fromSkill
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    type: {
      type: String,
      enum: ['prerequisite', 'related', 'optional'],
      default: 'prerequisite',
    },
    confidence: {
      // 0.0 – 1.0; seeded data = 1.0, LLM suggestions lower
      type: Number,
      default: 1.0,
      min: 0,
      max: 1,
    },
    source: {
      type: String,
      enum: ['seed', 'llm', 'manual'],
      default: 'seed',
    },
  },
  { timestamps: true }
);

// Each fromSkill → toSkill pair must be unique
skillRelationshipSchema.index({ fromSkill: 1, toSkill: 1 }, { unique: true });

module.exports = mongoose.model('SkillRelationship', skillRelationshipSchema);
