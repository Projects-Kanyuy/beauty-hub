import { useTranslation } from "react-i18next";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Button from "../components/Button";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-text-main">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-text-muted mt-4">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-text-main mb-6">
              {t("contact.sendMessage")}
            </h2>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-main mb-1"
                  >
                    {t("contact.fullName")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-main mb-1"
                  >
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-text-main mb-1"
                >
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text-main mb-1"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                ></textarea>
              </div>
              <Button type="submit" variant="gradient" className="w-full">
                {t("contact.sendButton")}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-text-main">
              {t("contact.contactInfo")}
            </h2>
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-3xl text-primary-purple mt-1" />
              <div>
                <h3 className="font-semibold text-lg">{t("contact.office")}</h3>
                <p className="text-text-muted">{t("contact.officeAddress")}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaPhone className="text-3xl text-primary-purple mt-1" />
              <div>
                <h3 className="font-semibold text-lg">{t("contact.phone")}</h3>
                <p className="text-text-muted">{t("contact.phoneNumber")}</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-3xl text-primary-purple mt-1" />
              <div>
                <h3 className="font-semibold text-lg">{t("contact.email")}</h3>
                <p className="text-text-muted">{t("contact.supportEmail")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
