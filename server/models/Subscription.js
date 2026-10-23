const mongoose = require('mongoose');

const CATEGORIES = [
  'Entertainment',
  'Productivity',
  'Design',
  'Development',
  'Cloud Services',
  'Education',
  'Communication',
  'Other',
];

const BILLING_CYCLES = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const STATUSES = ['Active', 'Paused', 'Cancelled'];

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
    },
    billingCycle: {
      type: String,
      required: [true, 'Billing cycle is required'],
      enum: {
        values: BILLING_CYCLES,
        message: '{VALUE} is not a valid billing cycle',
      },
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
      required: [true, 'Renewal date is required'],
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  CATEGORIES,
  BILLING_CYCLES,
  STATUSES,
};
