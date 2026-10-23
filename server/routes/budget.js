const express = require('express');
const { protect } = require('../middleware/auth');
const { getBudget, updateBudget } = require('../controllers/budgetController');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBudget)
  .put(updateBudget);

module.exports = router;
