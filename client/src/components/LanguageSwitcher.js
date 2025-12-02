import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-300
            ${
              i18n.language === code
                ? "bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-md"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
