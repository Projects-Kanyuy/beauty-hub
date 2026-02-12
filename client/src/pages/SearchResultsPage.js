import { useTranslation } from "react-i18next";

const SearchResultsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-heading">{t("searchResults.header")}</h1>
      <p className="mt-4">{t("searchResults.description")}</p>
    </div>
  );
};

export default SearchResultsPage;
