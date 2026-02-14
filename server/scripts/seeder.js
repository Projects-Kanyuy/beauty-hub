const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    console.log("Starting data seeding...");
    console.log(process.env.MONGO_URI);

    // 1️⃣ CONNECT AND WAIT
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // 2️⃣ IMPORT MODELS AFTER CONNECT
    const User = require("../models/userModel");
    const Salon = require("../models/salonModel");
    const SubscriptionType = require("../models/subscriptionTypeModel");
    const Coupon = require("../models/couponModel");
    const Appointment = require("../models/appointmentModel");
    const Review = require("../models/reviewModel");

    // 3️⃣ CLEAR DATA
    await Promise.all([
      User.deleteMany(),
      Salon.deleteMany(),
      SubscriptionType.deleteMany(),
      Coupon.deleteMany(),
      Appointment.deleteMany(),
      Review.deleteMany(),
    ]);

    const password = await bcrypt.hash("123456", 10);

    // 4️⃣ USERS
    const users = await User.insertMany([
      {
        name: "Lotachi",
        email: "lotaodi46@gmail.com",
        phone: "2348100000000",
        password,
        role: "customer",
        isVerified: true,
      },
      {
        name: "Jane Doh",
        email: "janedoh@example.com",
        phone: "2348100000001",
        password,
        role: "customer",
        isVerified: true,
      },
      {
        name: "Sarah Johnson",
        email: "sarahjohnson@example.com",
        phone: "2348100000002",
        password,
        role: "customer",
        isVerified: true,
      },
      {
        name: "John Doh",
        email: "johndoh@example.com",
        phone: "2348100000003",
        password,
        role: "customer",
        isVerified: true,
      },
      {
        name: "Salon Owner",
        email: "owner@example.com",
        phone: "2348111111111",
        password,
        role: "salon_owner",
        isVerified: true,
      },
    ]);

    const salonOwner = users.find((u) => u.role === "salon_owner");

    // 5️⃣ PLANS
    await SubscriptionType.insertMany([
      {
        planName: "Basic",
        slug: "basic",
        description: "Basic plan",
        planSpecs: ["1 Salon", "100 appointments per month"],
        amount: 5000,
        durationMonths: 1,
        createdBy: users[0]._id,
      },
      {
        planName: "Pro",
        slug: "pro",
        description: "Pro plan",
        planSpecs: ["5 Salons", "500 appointments per month"],
        amount: 15000,
        durationMonths: 1,
        createdBy: users[0]._id,
      },
    ]);

    // 6️⃣ SALON
    const salon = await Salon.create({
      owner: salonOwner._id,
      name: "Glamour Beauty Palace",
      description: "Best salon in town",
      address: "123 Main St",
      city: "Lagos",
      phone: "2348111111111",
      services: [
        { name: "Haircut", price: 1000, duration: 30 },
        { name: "Manicure", price: 500, duration: 45 },
        { name: "Box Braids", price: 3000, duration: 120 },
      ],
      isVerified: true,
    });

    // 7️⃣ APPOINTMENTS
    await Appointment.insertMany([
      {
        clientName: "Lotachi",
        clientNumber: users[0].phone,
        customer: users[0]._id,
        salon: salon._id,
        serviceId: salon.services[0]._id,
        appointmentDateTime: new Date(),
        amount: 1000,
        status: "Completed",
      },
    ]);

    // 8️⃣ REVIEWS
    await Review.insertMany([
      {
        user: users[0]._id,
        salon: salon._id,
        rating: 5,
        comment: "Excellent service!",
      },
    ]);

    console.log("Seeding complete");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
})();
