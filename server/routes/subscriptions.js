const express = require('express');
const { protect } = require('../middleware/auth');
const {
  validateSubscriptionId,
  validateCreateSubscription,
  validateUpdateSubscription,
} = require('../middleware/validateSubscription');
const {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');

const router = express.Router();

// Enforce authentication on all subscription routes
router.use(protect);

router
  .route('/')
  .get(getSubscriptions)
  .post(validateCreateSubscription, createSubscription);

router
  .route('/:id')
  .get(validateSubscriptionId, getSubscriptionById)
  .put(validateSubscriptionId, validateUpdateSubscription, updateSubscription)
  .delete(validateSubscriptionId, deleteSubscription);

module.exports = router;
