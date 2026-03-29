const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const dashboardController = require('../controllers/dashboardController');

router.get('/applications', auth, dashboardController.getUserApplications);
router.get('/employer-applications', auth, dashboardController.getEmployerApplications);
router.put('/applications/:id', auth, dashboardController.updateApplicationStatus);
router.get('/employer-jobs', auth, dashboardController.getEmployerJobs);

module.exports = router;
