const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, updateUser, deleteUser, getUsers } = require('../controllers/userControllers')
const { protect, isSuperAdmin } = require('../middleware/authMiddleware')

router.post('/register', protect, isSuperAdmin, registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/', protect, isSuperAdmin, getUsers)
router.route('/:id').delete(protect, isSuperAdmin, deleteUser).put(protect, isSuperAdmin, updateUser)



module.exports = router