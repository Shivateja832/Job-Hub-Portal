const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

router.post('/', auth, jobController.createJob);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);
router.post('/:id/apply', auth, jobController.applyJob);
router.get('/:id/applicants', auth, jobController.getApplicantsForJob);

module.exports = router;
