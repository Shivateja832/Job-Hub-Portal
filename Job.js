const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  responsibilities: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  location: { type: String, default: '' },
  salary: { type: String, default: '' },
  jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], default: 'Full-Time' },
  category: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
