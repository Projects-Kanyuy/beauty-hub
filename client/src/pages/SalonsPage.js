import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaFilter,
  FaMapMarkerAlt,
  FaSearch,
  FaSpinner,
  FaStar,
} from "react-icons/fa";
import { useSalons } from "../api/swr";
import SalonCard from "../components/SalonCard";

const SalonsPage = () => {
  const { t } = useTranslation();
  const [salons, setSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const {
    data: salonsData = [],
    isLoading: loading,
    error,
  } = useSalons();

  const locations =
    salons.length > 0
      ? [
          "all",
          ...new Set(
            salons.map((s) => s.location || t("salons.unknownLocation"))
          ),
        ]
      : ["all"];

  useEffect(() => {
    if (salonsData && salonsData.length > 0) {
      const shuffledData = [...salonsData].sort(() => Math.random() - 0.5);
      setSalons(shuffledData);
      setFilteredSalons(shuffledData);
    }
  }, [salonsData]);
  useEffect(() => {
    let filtered = salons;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (salon) =>
          salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (salon.description &&
            salon.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (salon) => salon.location === selectedLocation
      );
    }

    if (selectedRating !== "all") {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter((salon) => (salon.rating || 0) >= minRating);
    }

    setFilteredSalons(filtered);
  }, [searchQuery, selectedRating, selectedLocation, salons]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRating("all");
    setSelectedLocation("all");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {t("salons.header")}
          </h1>
          <p className="text-slate-300 text-lg">
            {t("salons.discover", { count: salons.length })}
          </p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="bg-slate-50 border-b sticky top-0 z-40 py-4 px-4">
        <div className="container mx-auto">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("salons.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
            >
              <FaFilter /> {t("salons.filters")}
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("salons.filterLocation")}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location === "all" ? t("salons.allLocations") : location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("salons.filterRating")}
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple"
                >
                  <option value="all">{t("salons.allRatings")}</option>
                  <option value="1">1+ {t("salons.stars")}</option>
                  <option value="2">2+ {t("salons.stars")}</option>
                  <option value="3">3+ {t("salons.stars")}</option>
                  <option value="4">4+ {t("salons.stars")}</option>
                  <option value="5">5 {t("salons.stars")}</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  {t("salons.resetFilters")}
                </button>
              </div>
            </div>
          )}

          {(searchQuery ||
            selectedRating !== "all" ||
            selectedLocation !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  {t("salons.activeSearch")}: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedLocation !== "all" && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  <FaMapMarkerAlt /> {selectedLocation}
                  <button
                    onClick={() => setSelectedLocation("all")}
                    className="hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedRating !== "all" && (
                <span className="inline-flex items-center gap-2 bg-primary-purple text-white px-3 py-1 rounded-full text-sm">
                  <FaStar /> {selectedRating}+ {t("salons.stars")}
                  <button
                    onClick={() => setSelectedRating("all")}
                    className="hover:opacity-75"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Salons Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <FaSpinner className="text-5xl text-primary-purple mx-auto animate-spin" />
              <p className="mt-4 font-semibold text-text-muted">
                {t("salons.loading")}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">{t("salons.errorTitle")}</h3>
              <p>{t("salons.fetchError")}</p>
            </div>
          ) : filteredSalons.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-gray-700">
                {t("salons.noResultsTitle")}
              </h3>
              <p className="text-text-muted mt-2">
                {t("salons.noResultsDesc")}
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-6 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-pink transition-colors font-medium"
              >
                {t("salons.resetFilters")}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-sm text-text-muted">
                {t("salons.showingResults", {
                  filtered: filteredSalons.length,
                  total: salons.length,
                })}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSalons.map((salon) => (
                  <SalonCard key={salon._id} salon={salon} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SalonsPage;