const Application = require('../models/Application');
const Job = require('../models/Job');

const validStatuses = ['Pending', 'Viewed', 'Shortlisted', 'Accepted', 'Rejected'];

exports.getUserApplications = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Only job seekers can view applications.' });

    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title description location salary jobType employer')
      .sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return res.json({ applications: [], message: 'No applications found. Start applying to jobs!', count: 0 });
    }

    res.json({ applications, count: applications.length });
  } catch (err) {
    console.error('Get user applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications. Please try again.' });
  }
};

exports.getEmployerApplications = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Only employers can view applications.' });

    const jobs = await Job.find({ employer: req.user.id });
    if (!jobs || jobs.length === 0) {
      return res.json({ applications: [], message: 'No jobs posted yet. Post a job to receive applications!', count: 0 });
    }

    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email resume location bio')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    res.json({ applications, count: applications.length });
  } catch (err) {
    console.error('Get employer applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications. Please try again.' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status) return res.status(400).json({ message: 'Status is required.' });
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found.' });

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this application.' });
    }

    const oldStatus = application.status;
    application.status = status;
    await application.save();

    res.json({ 
      ...application.toObject(), 
      message: `Application status updated from ${oldStatus} to ${status}.` 
    });
  } catch (err) {
    console.error('Update application status error:', err);
    res.status(500).json({ message: 'Failed to update application status. Please try again.' });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Only employers can view their jobs.' });

    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.json({ jobs: [], message: 'No jobs posted yet. Post your first job!', count: 0 });
    }

    const jobsWithStats = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ job: job._id });
      return { ...job.toObject(), applicantCount };
    }));

    res.json({ jobs: jobsWithStats, count: jobsWithStats.length });
  } catch (err) {
    console.error('Get employer jobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs. Please try again.' });
  }
};
