const mongoose = require('mongoose');
const User = require('./models/user');

async function createAdmin(name, email, plainPassword) {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db-name');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      return;
    }

    const adminUser = new User({
      name, // ✅ Add this line
      email,
      password: plainPassword, // Hashing will happen in the schema
      role: 'admin',
    });

    await adminUser.save();
    console.log(`✅ Admin user created: ${email}`);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    mongoose.disconnect();
  }
}

// Test it
createAdmin('Admin User', 'sam1@gmail.com', 'xyzzz'); // ✅ Now includes name
