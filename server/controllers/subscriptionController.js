const { Subscription } = require('../models/Subscription');

// @desc    Get all subscriptions for the authenticated user
// @route   GET /api/subscriptions
// @access  Private
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching subscriptions',
      error: error.message,
    });
  }
};

// @desc    Get a single subscription by ID
// @route   GET /api/subscriptions/:id
// @access  Private
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this subscription',
      });
    }

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching subscription',
      error: error.message,
    });
  }
};

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const {
      serviceName,
      category,
      price,
      currency,
      billingCycle,
      startDate,
      renewalDate,
      status,
      notes,
    } = req.body;

    const subscription = await Subscription.create({
      userId: req.user._id,
      serviceName: serviceName.trim(),
      category,
      price: Number(price),
      currency: currency ? currency.trim().toUpperCase() : 'USD',
      billingCycle,
      startDate: startDate ? new Date(startDate) : new Date(),
      renewalDate: new Date(renewalDate),
      status: status || 'Active',
      notes: notes ? notes.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while creating subscription',
      error: error.message,
    });
  }
};

// @desc    Update an existing subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this subscription',
      });
    }

    const {
      serviceName,
      category,
      price,
      currency,
      billingCycle,
      startDate,
      renewalDate,
      status,
      notes,
    } = req.body;

    if (serviceName !== undefined) subscription.serviceName = serviceName.trim();
    if (category !== undefined) subscription.category = category;
    if (price !== undefined) subscription.price = Number(price);
    if (currency !== undefined) subscription.currency = currency.trim().toUpperCase();
    if (billingCycle !== undefined) subscription.billingCycle = billingCycle;
    if (startDate !== undefined) subscription.startDate = new Date(startDate);
    if (renewalDate !== undefined) subscription.renewalDate = new Date(renewalDate);
    if (status !== undefined) subscription.status = status;
    if (notes !== undefined) subscription.notes = notes.trim();

    // Explicitly safeguard userId against tampering
    subscription.userId = req.user._id;

    const updatedSubscription = await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating subscription',
      error: error.message,
    });
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this subscription',
      });
    }

    await subscription.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting subscription',
      error: error.message,
    });
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
