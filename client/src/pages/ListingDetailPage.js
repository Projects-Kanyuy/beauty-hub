import { useTranslation } from "react-i18next"; // Importing the translation hook
import { useParams } from "react-router-dom"; // We'll use this hook

const ListingDetailPage = () => {
  const { t } = useTranslation(); // initialize the translation function
  // The useParams hook lets us read the ':id' from the URL
  const { id } = useParams();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-heading">{t("listingDetail.title")}</h1>
      <p className="mt-4">
        {t("listingDetail.showingDetails")} <strong>{id}</strong>
      </p>
      <p>{t("listingDetail.description")}</p>
    </div>
  );
};

export default ListingDetailPage;
