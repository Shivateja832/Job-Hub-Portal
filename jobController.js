const Job = require('../models/Job');
const Application = require('../models/Application');

// Validation helpers
const validateJobTitle = (title) => title && title.trim().length >= 3;
const validateJobDescription = (desc) => desc && desc.trim().length >= 10;

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Only employers can create jobs.' });

    const { title, description, location, jobType, salary } = req.body;

    // Input validation
    if (!title) return res.status(400).json({ message: 'Job title is required.' });
    if (!validateJobTitle(title)) return res.status(400).json({ message: 'Job title must be at least 3 characters.' });
    
    if (!description) return res.status(400).json({ message: 'Job description is required.' });
    if (!validateJobDescription(description)) return res.status(400).json({ message: 'Job description must be at least 10 characters.' });
    
    if (!location) return res.status(400).json({ message: 'Job location is required.' });
    if (!jobType) return res.status(400).json({ message: 'Job type is required.' });

    const job = new Job({ 
      ...req.body, 
      employer: req.user.id,
      title: title.trim(),
      description: description.trim(),
      location: location.trim()
    });
    await job.save();
    res.status(201).json({ ...job.toObject(), message: 'Job posted successfully!' });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ message: 'Failed to create job. Please try again.' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, salary, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (keyword) filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { qualifications: { $regex: keyword, $options: 'i' } }
    ];
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (salary) filter.salary = { $regex: salary, $options: 'i' };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(filter)
      .populate('employer', 'name company location')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await Job.countDocuments(filter);

    res.json({ 
      jobs, 
      pagination: { 
        total, 
        page: pageNum, 
        limit: limitNum, 
        pages: Math.ceil(total / limitNum) 
      } 
    });
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs. Please try again.' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company location');
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    res.json(job);
  } catch (err) {
    console.error('Get job by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch job. Please try again.' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'You do not have permission to update this job.' });

    const allowedFields = ['title', 'description', 'qualifications', 'experience', 'responsibilities', 'location', 'jobType', 'salary', 'isActive'];
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        job[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
      }
    });

    await job.save();
    res.json({ ...job.toObject(), message: 'Job updated successfully!' });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ message: 'Failed to update job. Please try again.' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'You do not have permission to delete this job.' });

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ message: 'Failed to delete job. Please try again.' });
  }
};

exports.applyJob = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') return res.status(403).json({ message: 'Only job seekers can apply.' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    const { coverLetter } = req.body;
    const existing = await Application.findOne({ job: req.params.id, applicant: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this job.' });

    const application = new Application({ 
      job: req.params.id, 
      applicant: req.user.id, 
      coverLetter: coverLetter ? coverLetter.trim() : '' 
    });
    await application.save();

    res.status(201).json({ ...application.toObject(), message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('Apply job error:', err);
    res.status(500).json({ message: 'Failed to apply job. Please try again.' });
  }
};

exports.getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (job.employer.toString() !== req.user.id) return res.status(403).json({ message: 'You do not have permission to view applicants.' });

    const applications = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email resume location bio')
      .sort({ createdAt: -1 });
    
    res.json({ applications, count: applications.length });
  } catch (err) {
    console.error('Get applicants error:', err);
    res.status(500).json({ message: 'Failed to fetch applicants. Please try again.' });
  }
};
