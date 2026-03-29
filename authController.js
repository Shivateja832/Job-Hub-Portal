const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validation helpers
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password && password.length >= 6;
const validateName = (name) => name && name.trim().length >= 2;

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company, location, bio } = req.body;

    // Input validation
    if (!name) return res.status(400).json({ message: 'Name is required.' });
    if (!validateName(name)) return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!validateEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address.' });
    
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    
    if (role && !['jobseeker', 'employer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be jobseeker or employer.' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) return res.status(400).json({ message: 'Email already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'jobseeker',
      company: company ? company.trim() : '',
      location: location ? location.trim() : '',
      bio: bio ? bio.trim() : ''
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        message: 'Registration successful!'
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });
    if (!validateEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        message: 'Login successful!'
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User profile not found.' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile. Please try again.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = ['name', 'location', 'bio', 'company', 'password'];
    
    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Validate name if provided
    if (updateData.name && !validateName(updateData.name)) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }

    // Validate and hash new password if provided
    if (updateData.password) {
      if (!validatePassword(updateData.password)) {
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Handle resume file upload
    if (req.file) {
      updateData.resume = req.file.filename;
    }

    // Trim string fields
    Object.keys(updateData).forEach(key => {
      if (typeof updateData[key] === 'string' && key !== 'password') {
        updateData[key] = updateData[key].trim();
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    res.json({ ...user.toObject(), message: 'Profile updated successfully!' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile. Please try again.' });
  }
};
