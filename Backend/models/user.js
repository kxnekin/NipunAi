const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define resume sub-schema (no _id for cleaner storage)
const resumeSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

// Define main User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  usn: {
    type: String,
  },
  branch: {
    type: String,
  },
  cgpa: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  resume: resumeSchema, // Embedded resume schema
}, { timestamps: true });

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
