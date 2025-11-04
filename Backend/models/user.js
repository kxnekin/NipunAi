const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  usn: { type: String },
  branch: { type: String },
  cgpa: { type: String, default: '' },
  phone: { type: String, default: '' },
  resume: {
    data: Buffer,
    contentType: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
