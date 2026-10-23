const mongoose = require('mongoose');

const defaultCategoryCaps = [
  { category: 'Cloud Services', cap: 80.0 },
  { category: 'Development', cap: 70.0 },
  { category: 'Design', cap: 50.0 },
  { category: 'Productivity', cap: 50.0 },
  { category: 'Entertainment', cap: 45.0 },
  { category: 'Communication', cap: 35.0 },
];

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    monthlyCap: {
      type: Number,
      required: true,
      default: 320.0,
      min: [1, 'Budget cap must be at least 1'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    categoryCaps: {
      type: [
        {
          category: { type: String, required: true },
          cap: { type: Number, required: true },
        },
      ],
      default: defaultCategoryCaps,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Budget', budgetSchema);
