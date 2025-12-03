"use client";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaChartLine, FaHeart, FaStore } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-main-bg.jpg";
import Button from "../components/Button";

const BecomeSalonOwnerPage = () => {
  const { t } = useTranslation();

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
            {t("becomeOwnerPage.hero.title")}
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
            {t("becomeOwnerPage.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Why BeautyHeaven */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t("becomeOwnerPage.why.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaStore className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {t("becomeOwnerPage.why.card1.title")}
              </h3>
              <p className="text-gray-600">
                {t("becomeOwnerPage.why.card1.text")}
              </p>
            </div>

            {/* card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaChartLine className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {t("becomeOwnerPage.why.card2.title")}
              </h3>
              <p className="text-gray-600">
                {t("becomeOwnerPage.why.card2.text")}
              </p>
            </div>

            {/* card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <IoAnalyticsOutline className="text-5xl text-primary-pink mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {t("becomeOwnerPage.why.card3.title")}
              </h3>
              <p className="text-gray-600">
                {t("becomeOwnerPage.why.card3.text")}
              </p>
            </div>

            {/* card 4 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <FaHeart className="text-5xl text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-3">
                {t("becomeOwnerPage.why.card4.title")}
              </h3>
              <p className="text-gray-600">
                {t("becomeOwnerPage.why.card4.text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-primary-purple to-primary-pink text-white py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">5000+</div>
            <p className="text-lg">{t("becomeOwnerPage.stats.salons")}</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">100K+</div>
            <p className="text-lg">{t("becomeOwnerPage.stats.bookings")}</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">50K+</div>
            <p className="text-lg">{t("becomeOwnerPage.stats.customers")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">
          {t("becomeOwnerPage.cta.title")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto justify-center items-center">
          <Link to="/subscriptions" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full px-8 py-6 text-lg border-2 border-primary-purple flex items-center justify-center gap-2"
            >
              {t("becomeOwnerPage.cta.pricing")} <FaArrowRight />
            </Button>
          </Link>

          <Link to="/register" className="w-full sm:w-auto">
            <Button
              variant="gradient"
              className="w-full px-8 py-6 text-lg flex items-center justify-center gap-2"
            >
              {t("becomeOwnerPage.cta.startFree")} <FaArrowRight />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("becomeOwnerPage.faq.title")}
          </h2>

          <div className="space-y-6">
            {["q1", "q2", "q3"].map((q, i) => (
              <div key={i} className="bg-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">
                  {t(`becomeOwnerPage.faq.${q}.question`)}
                </h3>
                <p className="text-gray-600">
                  {t(`becomeOwnerPage.faq.${q}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeSalonOwnerPage;
