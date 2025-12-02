import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart, FaStore, FaChartLine } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import Button from "../components/Button";
import heroBg from "../assets/hero-main-bg.jpg";

const BecomeSalonOwnerPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative text-center py-16 md:py-24 px-4"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Grow Your Beauty Business
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of salon owners already using BeautyHeaven to attract
            more customers, manage appointments, and grow their business faster.
          </p>
        </div>
      </section>

      {/* Why BeautyHeaven Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose BeautyHeaven?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaStore className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-3">Easy Management</h3>
              <p className="text-gray-600">
                Manage your salon profile, services, and appointments all in one
                place.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaChartLine className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">More Bookings</h3>
              <p className="text-gray-600">
                Get discovered by thousands of beauty-seeking customers in your
                area.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <IoAnalyticsOutline className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-3">Business Analytics</h3>
              <p className="text-gray-600">
                Track bookings, earnings, and customer insights to grow smarter.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaHeart className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">Direct Communication</h3>
              <p className="text-gray-600">
                Chat with customers, build relationships, and deliver better
                service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-purple to-primary-pink text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <p className="text-lg">Active Salons</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <p className="text-lg">Monthly Bookings</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <p className="text-lg">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Ready to Get Started?</h2>
          <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto justify-center items-center">
            <Link to="/subscriptions" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full px-8 py-6 text-lg border-2 border-primary-purple text-gray-800 hover:bg-gray-100 bg-transparent flex flex-row items-center justify-center gap-2"
              >
                See Our Pricing <FaArrowRight className="ml-2" />
              </Button>
            </Link>

            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="gradient"
                className="w-full px-8 py-6 flex flex-row items-center justify-center gap-2 text-lg"
              >
                Start for Free <FaArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Do I need a subscription to get started?
              </h3>
              <p className="text-gray-600">
                No! You can create your account and set up your salon profile
                for free. You only pay when you're ready to access premium
                features.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, absolutely. You can upgrade, downgrade, or cancel your plan
                anytime from your dashboard.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept credit cards, debit cards, and local payment methods
                like MTN MoMo and Orange Money.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeSalonOwnerPage;
