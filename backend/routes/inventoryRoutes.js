const express = require('express');
const router = express.Router();
const { getInventory, getInventoryById, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getInventory).post(protect, admin, createInventoryItem);
router.route('/:id').get(protect, admin, getInventoryById).put(protect, admin, updateInventoryItem).delete(protect, admin, deleteInventoryItem);

module.exports = router;
