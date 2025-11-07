// src/data/mockData.js
import salonImage1 from '../assets/salon1.jpg';
import salonImage2 from '../assets/salon2.jpg';
import salonImage3 from '../assets/salon3.jpg';
import salonCardImg1 from '../assets/salon-card-1.jpg'; // <-- Add placeholder images
import salonCardImg2 from '../assets/salon-card-2.jpg';
import salonCardImg3 from '../assets/salon-card-3.jpg';
import blogImg1 from '../assets/blog-1.jpg';
import blogImg2 from '../assets/blog-2.jpg';
import blogImg3 from '../assets/blog-3.jpg';
import { FaHeart, FaStar, FaCalendarCheck } from 'react-icons/fa';

export const featuredListings = [
  {
    id: 1,
    name: 'The Glam Room',
    address: '123 Beauty Ave, New York, NY',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: salonImage1,
  },
  {
    id: 2,
    name: 'Nail Nirvana',
    address: '456 Polish St, New York, NY',
    rating: 4.9,
    reviewCount: 98,
    imageUrl: salonImage2,
  },
  {
    id: 3,
    name: 'Serenity Spa',
    address: '789 Relaxation Rd, New York, NY',
    rating: 4.7,
    reviewCount: 210,
    imageUrl: salonImage3,
  },
];

export const categories = [
    { name: 'Hair Salons', icon: '✂️' },
    { name: 'Nail Studios', icon: '💅' },
    { name: 'Spas', icon: '🌿' },
    { name: 'Barbershops', icon: '💈' },
];

export const testimonials = [
    {
        id: 1,
        quote: "BeautyBook helped me find the perfect stylist for my wedding. The reviews were spot on!",
        author: "Jessica L.",
        location: "New York, NY",
    },
    {
        id: 2,
        quote: "As a salon owner, listing my business was a breeze and has brought in so many new clients.",
        author: "Maria G.",
        location: "Miami, FL",
    },
]

export const mockSalons = [
  {
    id: 1,
    name: 'Afro Chic Hair Studio',
    location: 'Douala, Cameroon',
    isVerified: true,
    distance: '2.5 km',
    imageUrl: salonCardImg1,
    rating: 4.8,
    reviewCount: 127,
    tags: ['Braiding', 'Natural Hair'],
    startingPrice: '₦15,000',
    responseTime: '~30 mins',
    isOnline: true,
  },
  {
    id: 2,
    name: 'Golden Nails Spa',
    location: 'Lagos, Nigeria',
    isVerified: true,
    distance: '2.5 km',
    imageUrl: salonCardImg2,
    rating: 4.6,
    reviewCount: 89,
    tags: ['Nails', 'Spa'],
    startingPrice: '₦8,000',
    responseTime: '~30 mins',
    isOnline: true,
  },
  {
    id: 3,
    name: 'Amara Beauty Lounge',
    location: 'Accra, Ghana',
    isVerified: true,
    distance: '2.5 km',
    imageUrl: salonCardImg3,
    rating: 4.9,
    reviewCount: 203,
    tags: ['Makeup', 'Spa & Facials'],
    startingPrice: '₵300',
    responseTime: '~30 mins',
    isOnline: true,
  },
];
export const mockBlogPosts = [
  {
    id: 1,
    category: 'Traditional Beauty',
    imageUrl: blogImg1,
    date: 'Jan 18, 2025',
    readTime: '7 min read',
    title: 'Traditional Shea Butter Beauty Secrets from Cameroon',
    excerpt: 'Discover how Cameroonian women have used pure, unrefined shea butter for centuries to achieve glowing skin and healthy hair.',
  },
  {
    id: 2,
    category: 'Hair Styling',
    imageUrl: blogImg2,
    date: 'Jan 16, 2025',
    readTime: '6 min read',
    title: 'Mastering the Art of Gele: Cameroon’s Elegant Headwrap Styles',
    excerpt: 'From simple everyday wraps to elaborate ceremonial styles, explore the rich tradition of gele headwraps in Cameroon and learn step-by-step techniques.',
  },
  {
    id: 3,
    category: 'Natural Skincare',
    imageUrl: blogImg3,
    date: 'Jan 14, 2025',
    readTime: '8 min read',
    title: 'Natural Skincare with Palm Oil and African Black Soap',
    excerpt: 'Unlock the secrets of Cameroon’s traditional skincare using locally sourced palm oil and authentic African black soap. Perfect for all skin types and ages.',
  },
];
export const mockUserFavorites = [1, 3]; // User has favorited 'Afro Chic' and 'Amara Beauty'
export const mockUserCompareList = [2, 3]; 
export const mockDashboardData = {
  userName: 'Beauty Lover',
  userLocation: 'Douala, Cameroon',
  stats: [
    { label: 'Appointments', value: 0, icon: '📅' },
    { label: 'Favorites', value: 0, icon: '💖' },
    { label: 'Reviews', value: 12, icon: '⭐' },
    { label: 'Comparing', value: 0, icon: '📊' },
  ],
  recentActivity: [
    {
      icon: FaHeart,
      color: 'text-pink-500',
      text: 'Added Afro Chic Hair Studio to favorites',
      time: '2 hours ago',
    },
    {
      icon: FaStar,
      color: 'text-yellow-500',
      text: 'Left a 5-star review for Golden Nails Spa',
      time: '1 day ago',
    },
    {
      icon: FaCalendarCheck,
      color: 'text-green-500',
      text: 'Booked appointment at Amara Beauty Lounge',
      time: '3 days ago',
    },
  ],
};
export const mockSalonDashboardData = {
  salonName: 'Afro Chic Hair Studio',
  stats: [
    { label: 'Today\'s Bookings', value: 3 },
    { label: 'Pending Requests', value: 2 },
    { label: 'Total Earnings (Month)', value: '₦350,000' },
    { label: 'New Reviews', value: 4 },
  ],
  upcomingAppointments: [
    { time: '10:00 AM', customer: 'Aisha Bello', service: 'Box Braids' },
    { time: '01:00 PM', customer: 'Fatima Diallo', service: 'Cornrows' },
    { time: '03:30 PM', customer: 'Ngozi Okafor', service: 'Hair Treatment' },
  ],
  recentMessages: [
    { customer: 'Aisha Bello', text: 'Hi, can I come 15 mins early?' },
    { customer: 'David Okon', text: 'Do you offer services for men?' },
  ]
};
// FullCalendar uses ISO 8601 date format (YYYY-MM-DDTHH:mm:ss)
export const mockAppointments = [
  {
    id: '1',
    title: 'Aisha Bello - Box Braids',
    start: '2025-10-06T10:00:00',
    end: '2025-10-06T13:00:00',
    extendedProps: {
      service: 'Box Braids',
      customer: 'Aisha Bello',
      status: 'Confirmed'
    }
  },
  {
    id: '2',
    title: 'Fatima Diallo - Cornrows',
    start: '2025-10-06T13:00:00',
    end: '2025-10-06T15:30:00',
     extendedProps: {
      service: 'Cornrows',
      customer: 'Fatima Diallo',
      status: 'Confirmed'
    }
  },
  {
    id: '3',
    title: 'Ngozi Okafor - Hair Treatment',
    start: '2025-10-08T11:00:00',
    end: '2025-10-08T12:00:00',
     extendedProps: {
      service: 'Hair Treatment',
      customer: 'Ngozi Okafor',
      status: 'Pending'
    }
  },
];
export const mockSalonServices = [
  {
    id: 'svc_01',
    name: 'Box Braids (Medium)',
    description: 'Classic and versatile box braids. Hair extensions are included.',
    price: 25000,
    duration: 180, // in minutes
  },
  {
    id: 'svc_02',
    name: 'Cornrows (Basic)',
    description: 'Simple and elegant cornrow styling.',
    price: 8000,
    duration: 60,
  },
  {
    id: 'svc_03',
    name: 'Deep Conditioning Treatment',
    description: 'A nourishing treatment to restore moisture and shine to your hair.',
    price: 10000,
    duration: 45,
  },
];
export const mockSalonMessages = [
  {
    id: 'msg_1',
    customerName: 'Aisha Bello',
    lastMessage: 'Hi, can I come 15 mins early?',
    timestamp: '10:30 AM',
    unread: 2,
    messages: [
      { sender: 'customer', text: 'Hello! I have an appointment for 10am.' },
      { sender: 'owner', text: 'Yes, Aisha! We are looking forward to seeing you.' },
      { sender: 'customer', text: 'Hi, can I come 15 mins early?' },
    ],
  },
  {
    id: 'msg_2',
    customerName: 'David Okon',
    lastMessage: 'Do you offer services for men?',
    timestamp: 'Yesterday',
    unread: 0,
    messages: [
      { sender: 'customer', text: 'Do you offer services for men?' },
    ],
  },
];

export const mockSalonReviews = [
  {
    id: 'rev_1',
    customerName: 'Ngozi Okafor',
    rating: 5,
    comment: 'Absolutely amazing service! The best box braids I have ever had. The salon is clean and the staff are so professional. Will definitely be back!',
    date: '2 days ago',
    service: 'Box Braids',
    reply: null,
  },
  {
    id: 'rev_2',
    customerName: 'Fatima Diallo',
    rating: 4,
    comment: 'Great cornrows and friendly service. The waiting time was a little long, but the final result was worth it.',
    date: '1 week ago',
    service: 'Cornrows',
    reply: 'Thank you, Fatima! We appreciate your feedback and are working to reduce wait times. Glad you loved your hair!',
  },
];

export const mockSalonAnalytics = {
  kpis: {
    totalEarnings: 350000,
    newClients: 14,
    completedAppointments: 45,
    avgRating: 4.8,
  },
  bookingsOverTime: [
    { month: 'Jul', bookings: 25 }, { month: 'Aug', bookings: 30 }, { month: 'Sep', bookings: 42 }, { month: 'Oct', bookings: 45 },
  ],
  servicePopularity: [
    { name: 'Box Braids', value: 40 }, { name: 'Cornrows', value: 25 }, { name: 'Treatments', value: 15 }, { name: 'Other', value: 20 },
  ],
};

export const mockSalonSettings = {
  account: {
    email: 'contact@afrochic.com',
  },
  notifications: {
    newBooking: true,
    newReview: true,
    newMessage: false,
  },
};