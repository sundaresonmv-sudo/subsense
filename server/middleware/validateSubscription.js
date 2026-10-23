const mongoose = require('mongoose');
const { CATEGORIES, BILLING_CYCLES, STATUSES } = require('../models/Subscription');

const isValidDate = (dateValue) => {
  if (!dateValue) return false;
  const parsed = new Date(dateValue);
  return !isNaN(parsed.getTime());
};

const validateSubscriptionId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription ID format',
    });
  }

  next();
};

const validateCreateSubscription = (req, res, next) => {
  const { serviceName, category, price, billingCycle, renewalDate, startDate, status } = req.body;

  if (!serviceName || typeof serviceName !== 'string' || serviceName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Service name is required',
    });
  }

  if (price === undefined || price === null || price === '') {
    return res.status(400).json({
      success: false,
      message: 'Price is required',
    });
  }

  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number greater than 0',
    });
  }

  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Category is required',
    });
  }

  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed categories: ${CATEGORIES.join(', ')}`,
    });
  }

  if (!billingCycle) {
    return res.status(400).json({
      success: false,
      message: 'Billing cycle is required',
    });
  }

  if (!BILLING_CYCLES.includes(billingCycle)) {
    return res.status(400).json({
      success: false,
      message: `Invalid billing cycle. Allowed billing cycles: ${BILLING_CYCLES.join(', ')}`,
    });
  }

  if (!renewalDate) {
    return res.status(400).json({
      success: false,
      message: 'Renewal date is required',
    });
  }

  if (!isValidDate(renewalDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid renewal date format',
    });
  }

  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid start date format',
    });
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed statuses: ${STATUSES.join(', ')}`,
    });
  }

  next();
};

const validateUpdateSubscription = (req, res, next) => {
  const { serviceName, category, price, billingCycle, renewalDate, startDate, status } = req.body;

  if (serviceName !== undefined) {
    if (typeof serviceName !== 'string' || serviceName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Service name cannot be empty',
      });
    }
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number greater than 0',
      });
    }
  }

  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Allowed categories: ${CATEGORIES.join(', ')}`,
    });
  }

  if (billingCycle !== undefined && !BILLING_CYCLES.includes(billingCycle)) {
    return res.status(400).json({
      success: false,
      message: `Invalid billing cycle. Allowed billing cycles: ${BILLING_CYCLES.join(', ')}`,
    });
  }

  if (renewalDate !== undefined && !isValidDate(renewalDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid renewal date format',
    });
  }

  if (startDate !== undefined && !isValidDate(startDate)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid start date format',
    });
  }

  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed statuses: ${STATUSES.join(', ')}`,
    });
  }

  next();
};

module.exports = {
  validateSubscriptionId,
  validateCreateSubscription,
  validateUpdateSubscription,
};
