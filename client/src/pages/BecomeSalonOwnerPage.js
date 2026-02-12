"use client";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaChartLine, FaHeart, FaStore } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpg";
import Button from "../components/Button";

const BecomeSalonOwnerPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white font-sans">
      {/* ================= HERO ================= */}
      <section
        className="relative text-center flex items-center justify-center py-24 md:py-40 px-6"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative z-10 text-white max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            {t("becomeOwnerPage.hero.title")}
          </h1>

          <p className="text-lg md:text-2xl opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("becomeOwnerPage.hero.subtitle")}
          </p>

          {/* >>> Hero CTA buttons — visible + standout <<< */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-4">
            <Link to="/register">
              <Button
                variant="gradient"
                className="px-10 py-5 text-lg rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                {t("becomeOwnerPage.cta.startFree")} <FaArrowRight />
              </Button>
            </Link>

            <Link to="/subscriptions">
              <Button
                variant="outline"
                className="px-10 py-5 text-lg rounded-full border-2 border-white hover:bg-white hover:text-primary-purple transition-all flex items-center gap-2"
              >
                {t("becomeOwnerPage.cta.pricing")} <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY SECTION ================= */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-14">
          {t("becomeOwnerPage.why.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {/* card */}
          {[
            { icon: <FaStore />, color: "text-primary-pink", key: "card1" },
            {
              icon: <FaChartLine />,
              color: "text-primary-purple",
              key: "card2",
            },
            {
              icon: <IoAnalyticsOutline />,
              color: "text-primary-pink",
              key: "card3",
            },
            { icon: <FaHeart />, color: "text-primary-purple", key: "card4" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className={`text-5xl mb-5 ${item.color}`}>{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">
                {t(`becomeOwnerPage.why.${item.key}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`becomeOwnerPage.why.${item.key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gradient-to-r from-primary-purple to-primary-pink text-white py-20 px-6 text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14">
          {[
            { num: "5000+", text: t("becomeOwnerPage.stats.salons") },
            { num: "100K+", text: t("becomeOwnerPage.stats.bookings") },
            { num: "50K+", text: t("becomeOwnerPage.stats.customers") },
          ].map((it, i) => (
            <div key={i}>
              <p className="text-5xl font-extrabold mb-3">{it.num}</p>
              <p className="text-lg opacity-90">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA SECTION (SECONDARY) ================= */}
      <section className="py-20 text-center px-6">
        <h2 className="text-4xl font-bold mb-10">
          {t("becomeOwnerPage.cta.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto">
          <Link to="/subscriptions">
            <Button
              variant="outline"
              className="px-10 py-5 text-lg rounded-full border-primary-purple flex items-center gap-2"
            >
              {t("becomeOwnerPage.cta.pricing")} <FaArrowRight />
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="gradient"
              className="px-10 py-5 text-lg rounded-full flex items-center gap-2"
            >
              {t("becomeOwnerPage.cta.startFree")} <FaArrowRight />
            </Button>
          </Link>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("becomeOwnerPage.faq.title")}
          </h2>

          <div className="space-y-6">
            {["q1", "q2", "q3"].map((q, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg mb-2">
                  {t(`becomeOwnerPage.faq.${q}.question`)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
