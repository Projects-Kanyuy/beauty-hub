import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";

const FloatingActions = () => {
  const { t } = useTranslation();

  // Your exact WhatsApp number and message logic
  const whatsappNumber = "+237652301511";
  const defaultMsg = t("whatsappMessage");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMsg
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:bg-[#128C7E] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={36} />
      </a>
    </div>
  );
};

export default FloatingActions;