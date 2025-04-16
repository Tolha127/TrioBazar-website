/**
 * Script to initialize the first admin user in the database
 * Run this once during initial setup: node scripts/init-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const readline = require('readline');

// Create readline interface for secure input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Prompt for admin credentials
const createAdminUser = async () => {
  try {
    console.log('\n=== TrioBazaar Admin Initialization ===\n');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️ An admin user already exists in the database.');
      console.log('If you need to reset admin access, please use the password reset function or contact your database administrator.');
      mongoose.disconnect();
      rl.close();
      return;
    }
    
    // Prompt for admin details
    rl.question('Enter admin username: ', (username) => {
      rl.question('Enter admin email: ', (email) => {
        rl.question('Enter admin password (min 8 characters): ', async (password) => {
          
          if (password.length < 8) {
            console.log('❌ Password must be at least 8 characters long.');
            mongoose.disconnect();
            rl.close();
            return;
          }
          
          try {
            // Create admin user
            const admin = new User({
              username,
              email,
              password,
              role: 'admin',
              isActive: true
            });
            
            await admin.save();
            
            console.log('\n✅ Admin user created successfully!');
            console.log(`Username: ${username}`);
            console.log(`Email: ${email}`);
            console.log('\nYou can now log in to the admin dashboard.');
            
            mongoose.disconnect();
            rl.close();
          } catch (error) {
            console.error('❌ Error creating admin user:', error.message);
            mongoose.disconnect();
            rl.close();
          }
        });
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
    rl.close();
  }
};

// Run the script
createAdminUser();
