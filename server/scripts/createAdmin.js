// scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../models/userModel.js');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ask = (q) => new Promise(r => rl.question(q, r));

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('❌ MONGO_URI not found in .env file!');
      process.exit(1);
    }

    // Hide password in the URL for security but show everything else
    const hiddenUri = process.env.MONGO_URI.replace(/\/\/([^@]+)@/, '//****:****@');
    console.log(`\nAttempting to connect to:\n${hiddenUri}\n`);

    // Force fresh connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const dbName = mongoose.connection.db.databaseName;
    const fullUrl = mongoose.connection.getClient().options.srvHost 
      ? `mongodb+srv://${mongoose.connection.host}/${dbName}`
      : `${mongoose.connection.host}:${mongoose.connection.port}/${dbName}`;

    console.log(`CONNECTED TO → ${fullUrl} (Database: "${dbName}")\n`);

    const email = (await ask('Admin email: ')).trim().toLowerCase();
    const password = await ask('Admin password: ');
    const name = (await ask('Admin name (optional): ')).trim() || 'Super Admin';

    if (!email || !password) {
      console.log('Email and password are required!');
      rl.close(); process.exit(1);
    }

    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`User with email "${email}" already exists in this database!`);
      rl.close(); process.exit(0);
    }

    // const salt = await bcrypt.genSalt(10);
    // const hashed = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: password,
      role: 'admin',
      isVerified: true,
    });

    await admin.save();

    console.log('\nADMIN CREATED SUCCESSFULLY!');
    console.log('=====================================');
    console.log(`Database : ${dbName}`);
    console.log(`Name     : ${admin.name}`);
    console.log(`Email    : ${admin.email}`);
    console.log(`Role     : ${admin.role}`);
    console.log(`User ID  : ${admin._id}`);
    console.log('=====================================\n');
    console.log('You can now login immediately with these credentials!\n');

    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection or creation failed:', err.message);
    rl.close();
    process.exit(1);
  }
})();
