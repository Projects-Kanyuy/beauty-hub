const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    console.log("Starting data seeding...");

    // 1️⃣ CONNECT TO MONGODB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 2️⃣ REQUIRE MODELS
    const User = require("../models/userModel");
    const Salon = require("../models/salonModel");
    const SubscriptionType = require("../models/subscriptionTypeModel");
    const Appointment = require("../models/appointmentModel");
    const Review = require("../models/reviewModel");

    // 3️⃣ CLEAR OLD DATA
    console.log("Clearing old data...");
    await Promise.all([
      User.deleteMany(),
      Salon.deleteMany(),
      SubscriptionType.deleteMany(),
      Appointment.deleteMany(),
      Review.deleteMany(),
    ]);

    const password = await bcrypt.hash("123456", 10);

    // 4️⃣ CREATE ADMIN USER (Required for SubscriptionType 'createdBy' field)
    const admin = await User.create({
      name: "BeautyHeaven Admin",
      email: "admin@beautyheaven.com",
      phone: "000",
      password: password,
      role: "admin",
      isVerified: true
    });
    console.log("Admin user created");

    // 5️⃣ CREATE SUBSCRIPTION PLANS (USD + Characteristics)
    console.log("Seeding Subscription Plans...");
    await SubscriptionType.insertMany([
      {
        planName: "Basic",
        slug: "basic-plan",
        amount: 15,
        currency: "USD",
        durationMonths: 1,
        createdBy: admin._id, // Now correctly defined
        planSpecs: [
          "List up to 5 services",
          "WhatsApp Integration",
          "Basic Business Profile",
          "Appear in search results"
        ],
      },
      {
        planName: "Pro",
        slug: "pro-plan",
        amount: 30,
        currency: "USD",
        durationMonths: 1,
        createdBy: admin._id, // Now correctly defined
        planSpecs: [
          "Unlimited service listings",
          "Priority 'Featured' placement",
          "Advanced Analytics dashboard",
          "WhatsApp & Direct Booking",
          "Verified Business Badge"
        ],
      }
    ]);

    // 6️⃣ CREATE UNIQUE OWNERS FOR EACH SALON
    console.log("Creating Salon Owners...");
    const users = await User.insertMany([
      { name: "Owner Glamour", email: "glamour@test.com", phone: "111", password, role: "salon_owner", isVerified: true },
      { name: "Owner Vixen", email: "vixen@test.com", phone: "222", password, role: "salon_owner", isVerified: true },
      { name: "Owner Royal", email: "royal@test.com", phone: "333", password, role: "salon_owner", isVerified: true },
      { name: "Owner Zuri", email: "zuri@test.com", phone: "444", password, role: "salon_owner", isVerified: true },
      { name: "Owner Lusaka", email: "lusaka@test.com", phone: "555", password, role: "salon_owner", isVerified: true },
    ]);

    // 7️⃣ SALONS - Assigned to individual owners (Prices in USD)
    console.log("Creating Salons...");
    const salons = await Salon.insertMany([
      {
        owner: users[0]._id,
        name: "Glamour Beauty Palace",
        description: "Premium beauty and styling",
         slug: "glamour-beauty-palace",
        address: "Lagos",
        city: "Lagos",
        country: "Nigeria",
        phone: "2348111111111",
        services: [{ name: "Haircut", price: 15, duration: 30 }],
        isVerified: true,
      },
      {
        owner: users[1]._id,
        name: "Vixen Beauty Palace",
        description: "Luxury treatments and spa",
       slug: "vixen-beauty-palace",
        address: "Bonapriso",
        city: "Douala",
        country: "Cameroon",
        phone: "237655000111",
        services: [{ name: "Pedicure", price: 10, duration: 50 }],
        isVerified: true,
      },
      {
        owner: users[2]._id,
        name: "Royal Touch Salon",
        description: "Elegant and sophisticated services",
         slug: "Royal-Touch-Salon",
        address: "Bastos",
        city: "Yaoundé",
        country: "Cameroon",
        phone: "237677123456",
        services: [{ name: "Facial", price: 25, duration: 60 }],
        isVerified: true,
      },
      {
        owner: users[3]._id,
        name: "Zuri Beauty Hub",
        description: "Modern African beauty and braids",
         slug: "zuri-beauty-hub",
        address: "Kariakoo",
        city: "Dar es Salaam",
        country: "Tanzania",
        phone: "255712345678",
        services: [{ name: "Makeup", price: 30, duration: 90 }],
        isVerified: true,
      },
      {
        owner: users[4]._id,
        name: "Lusaka Glam Studio",
        description: "Top-tier nail and lash services",
         slug: "lusaka-glam-studio",
        address: "Cairo Road",
        city: "Lusaka",
        country: "Zambia",
        phone: "260971234567",
        services: [{ name: "Nail Extensions", price: 40, duration: 120 }],
        isVerified: true,
      },
    ]);

    // 8️⃣ TEST APPOINTMENT
    await Appointment.create({
      clientName: "Test Client",
      clientNumber: "000",
      customer: users[0]._id,
      salon: salons[0]._id,
      serviceId: salons[0].services[0]._id,
      appointmentDateTime: new Date(),
      amount: 15,
      status: "Completed",
    });

    console.log("Seeding complete! Admin, USD Plans, Owners, and Salons are ready.");
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
})();