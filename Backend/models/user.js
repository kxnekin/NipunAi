const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define resume sub-schema
const resumeSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
}, { _id: false }); // _id false so MongoDB doesn’t create an ID for each resume object

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
    default: 'user', // can be 'student' or 'admin'
  },
  usn: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },

  // ✅ Resume storage (PDF in DB)
  resume: resumeSchema,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
