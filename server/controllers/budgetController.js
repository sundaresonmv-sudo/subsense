const Budget = require('../models/Budget');

// @desc    Get user budget configuration
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user._id });

    if (!budget) {
      budget = await Budget.create({
        userId: req.user._id,
        monthlyCap: 320.0,
      });
    }

    return res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching budget',
      error: error.message,
    });
  }
};

// @desc    Update user budget configuration
// @route   PUT /api/budget
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const { monthlyCap, categoryCaps } = req.body;

    if (monthlyCap !== undefined) {
      const numCap = Number(monthlyCap);
      if (isNaN(numCap) || numCap <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Monthly budget cap must be a positive number greater than 0',
        });
      }
    }

    let budget = await Budget.findOne({ userId: req.user._id });

    if (!budget) {
      budget = new Budget({
        userId: req.user._id,
        monthlyCap: monthlyCap !== undefined ? Number(monthlyCap) : 320.0,
        categoryCaps: Array.isArray(categoryCaps) ? categoryCaps : undefined,
      });
    } else {
      if (monthlyCap !== undefined) budget.monthlyCap = Number(monthlyCap);
      if (Array.isArray(categoryCaps)) budget.categoryCaps = categoryCaps;
    }

    const saved = await budget.save();

    return res.status(200).json({
      success: true,
      message: 'Budget settings updated successfully',
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while updating budget',
      error: error.message,
    });
  }
};

module.exports = {
  getBudget,
  updateBudget,
};
