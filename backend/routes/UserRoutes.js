const express = require('express');
const router = express.Router();
const {
  registerUser,
  getAllUsers
} = require('../controllers/UserController');

// POST /api/users
router.post('/', registerUser);

// GET /api/users
router.get('/', getAllUsers);

module.exports = router;
