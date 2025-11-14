// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const salonRoutes = require('./routes/salonRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB(); // Establish database connection
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BeautyHub API is running...');
});

// --- Use our new routes ---
app.use('/api/users', userRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/messages',messageRoutes)
// const path = require('path');
// if (process.env.NODE_ENV === 'production') {
//   // 1. Set the build folder to be a static folder
//   app.use(express.static(path.join(__dirname, '../client/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'))
//   );
// } else {
  // In development, just run the API
  // app.get('/', (req, res) => {
  //   res.send('BeautyHub API is running...');
  // });
// }

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
