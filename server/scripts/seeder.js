const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    console.log("Starting data seeding...");

    // 1️⃣ CONNECT
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 2️⃣ MODELS
    const User = require("../models/userModel");
    const Salon = require("../models/salonModel");
    const SubscriptionType = require("../models/subscriptionTypeModel");
    const Appointment = require("../models/appointmentModel");
    const Review = require("../models/reviewModel");

    // 3️⃣ CLEAR OLD DATA
    await Promise.all([
      User.deleteMany(),
      Salon.deleteMany(),
      SubscriptionType.deleteMany(),
      Appointment.deleteMany(),
      Review.deleteMany(),
    ]);

    const password = await bcrypt.hash("123456", 10);

    // 4️⃣ CREATE UNIQUE OWNERS FOR EACH SALON
    const users = await User.insertMany([
      { name: "Owner Glamour", email: "glamour@test.com", phone: "111", password, role: "salon_owner", isVerified: true },
      { name: "Owner Vixen", email: "vixen@test.com", phone: "222", password, role: "salon_owner", isVerified: true },
      { name: "Owner Royal", email: "royal@test.com", phone: "333", password, role: "salon_owner", isVerified: true },
      { name: "Owner Zuri", email: "zuri@test.com", phone: "444", password, role: "salon_owner", isVerified: true },
      { name: "Owner Lusaka", email: "lusaka@test.com", phone: "555", password, role: "salon_owner", isVerified: true },
    ]);

    // 5️⃣ PLANS
    await SubscriptionType.insertMany([
      { planName: "Basic", slug: "basic", amount: 5000, durationMonths: 1, createdBy: users[0]._id },
      { planName: "Pro", slug: "pro", amount: 15000, durationMonths: 1, createdBy: users[0]._id },
    ]);

    // 6️⃣ SALONS - Assigned to individual owners
    const salons = await Salon.insertMany([
      {
        owner: users[0]._id, // Belongs to glamour@test.com
        name: "Glamour Beauty Palace",
        description: "Premium beauty",
        address: "Lagos",
        city: "Lagos",
        country: "Nigeria",
        phone: "2348111111111",
        services: [{ name: "Haircut", price: 1000, duration: 30 }],
        isVerified: true,
      },
      {
        owner: users[1]._id, // Belongs to vixen@test.com
        name: "Vixen Beauty Palace",
        description: "Luxury treatments",
        address: "Bonapriso",
        city: "Douala",
        country: "Cameroon",
        phone: "237655000111",
        services: [{ name: "Pedicure", price: 700, duration: 50 }],
        isVerified: true,
      },
      {
        owner: users[2]._id, // Belongs to royal@test.com
        name: "Royal Touch Salon",
        description: "Elegant services",
        address: "Bastos",
        city: "Yaoundé",
        country: "Cameroon",
        phone: "237677123456",
        services: [{ name: "Facial", price: 2500, duration: 60 }],
        isVerified: true,
      },
      {
        owner: users[3]._id, // Belongs to zuri@test.com
        name: "Zuri Beauty Hub",
        description: "Modern African beauty",
        address: "Kariakoo",
        city: "Dar es Salaam",
        country: "Tanzania",
        phone: "255712345678",
        services: [{ name: "Makeup", price: 3000, duration: 90 }],
        isVerified: true,
      },
      {
        owner: users[4]._id, // Belongs to lusaka@test.com
        name: "Lusaka Glam Studio",
        description: "Top-tier services",
        address: "Cairo Road",
        city: "Lusaka",
        country: "Zambia",
        phone: "260971234567",
        services: [{ name: "Nail Extensions", price: 4000, duration: 120 }],
        isVerified: true,
      },
    ]);

    // 7️⃣ TEST DATA (LINKED TO FIRST SALON)
    await Appointment.create({
      clientName: "Test Client",
      clientNumber: "000",
      customer: users[0]._id,
      salon: salons[0]._id,
      serviceId: salons[0].services[0]._id,
      appointmentDateTime: new Date(),
      amount: 1000,
      status: "Completed",
    });

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
})();