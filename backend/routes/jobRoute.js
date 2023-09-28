const express = require('express')
const router = express.Router()
const { getJobs, setJobs, updateJobs, deleteJobs, getJobById } = require('../controllers/jobControllers')
const { authenticateAdmin, protect, isAdmin, isSuperAdmin } = require('../middleware/authMiddleware')


router.route('/').get(getJobs).post(protect, isAdmin, setJobs)
router.route('/:id').get(getJobById).delete(protect, isAdmin, deleteJobs).put(protect, isAdmin, updateJobs)


module.exports = router