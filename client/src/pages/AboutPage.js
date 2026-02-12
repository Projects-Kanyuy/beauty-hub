import { useTranslation } from "react-i18next";
import { FaBullseye, FaHandsHelping, FaUsers } from "react-icons/fa";
import aboutHeroImage from "../assets/about-hero.jpg";

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative py-24 px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutHeroImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 container mx-auto text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4">
            {t("about.heroTitle")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">{t("about.heroSubtitle")}</p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-text-main mb-4">
              {t("about.missionTitle")}
            </h2>
            <p className="text-text-muted mb-4">{t("about.missionText1")}</p>
            <p className="text-text-muted">{t("about.missionText2")}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <FaBullseye className="text-4xl text-primary-purple mx-auto mb-3" />
              <h3 className="font-bold text-lg">
                {t("about.empowerment.title")}
              </h3>
              <p className="text-sm text-text-muted">
                {t("about.empowerment.desc")}
              </p>
            </div>
            <div className="bg-pink-50 p-6 rounded-lg text-center">
              <FaUsers className="text-4xl text-primary-pink mx-auto mb-3" />
              <h3 className="font-bold text-lg">
                {t("about.community.title")}
              </h3>
              <p className="text-sm text-text-muted">
                {t("about.community.desc")}
              </p>
            </div>
            <div className="bg-pink-50 p-6 rounded-lg text-center">
              <FaHandsHelping className="text-4xl text-primary-pink mx-auto mb-3" />
              <h3 className="font-bold text-lg">{t("about.trust.title")}</h3>
              <p className="text-sm text-text-muted">{t("about.trust.desc")}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <FaBullseye className="text-4xl text-primary-purple mx-auto mb-3" />
              <h3 className="font-bold text-lg">{t("about.quality.title")}</h3>
              <p className="text-sm text-text-muted">
                {t("about.quality.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section. */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-main mb-4">
            {t("about.ctaTitle")}
          </h2>
          <p className="text-text-muted mb-8 max-w-2xl mx-auto">
            {t("about.ctaText")}
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-primary-pink to-primary-purple hover:opacity-90 transition-opacity"
            >
              {t("about.exploreSalons")}
            </a>
            <a
              href="/subscriptions"
              className="px-8 py-3 rounded-lg font-bold bg-white border-2 border-gray-300 text-text-main hover:bg-gray-100 transition-colors"
            >
              {t("about.listBusiness")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
