import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FaFilter, FaSearch, FaSpinner, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { useSalons } from "../api/swr";
import SalonCard from "../components/SalonCard";

const SalonsPage = () => {
  const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const [pageNumber, setPageNumber] = useState(1); // BOSS REQUIREMENT: PAGINATION
  const [salons, setSalons] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

   const { data: salonsData, isLoading: loading, error, mutate } = useSalons(pageNumber, keyword);

  useEffect(() => {
    // Correctly extract the array from the paginated object
    if (salonsData?.salons) {
      setSalons(salonsData.salons);
    }
  }, [salonsData]);

  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="bg-[#1D1D1F] text-white py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{t("salons.header")}</h1>
          <p className="text-gray-400 text-lg">{t("salons.discover", { count: salonsData?.totalSalons || 0 })}</p>
        </div>
      </section>

      <section className="bg-white border-b sticky top-0 z-40 py-4 px-6 shadow-sm">
        <div className="container mx-auto flex gap-4">
           <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder={t("salons.searchPlaceholder")} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-purple outline-none font-medium" />
           </div>
           <button onClick={() => setShowFilters(!showFilters)} className="px-6 bg-gray-50 rounded-2xl font-bold flex items-center gap-2"><FaFilter /> {t("salons.filters")}</button>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20"><FaSpinner className="animate-spin text-5xl text-primary-purple mx-auto" /></div>
        ) : error ? (
          /* BOSS REQUIREMENT: IMPROVED ERROR HANDLING */
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100 max-w-xl mx-auto p-10">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-black text-red-700 leading-tight">Server Connection Error</h2>
            <p className="text-red-600 mt-2">The system is taking a bit long to respond. This usually happens when the backend is waking up.</p>
            <button onClick={() => mutate()} className="mt-8 bg-red-600 text-white px-10 py-3 rounded-full font-black shadow-lg">Retry Connection</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {salons.map((salon) => <SalonCard key={salon._id} salon={salon} />)}
            </div>

            {/* BOSS REQUIREMENT: PAGINATION UI */}
            {salonsData?.pages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-6">
                <button 
                  disabled={pageNumber === 1}
                  onClick={() => { setPageNumber(p => p - 1); window.scrollTo(0,0); }}
                  className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
                >
                   <FaArrowLeft />
                </button>
                
                <span className="font-black text-xl">Page {salonsData.page} of {salonsData.pages}</span>

                <button 
                  disabled={pageNumber === salonsData.pages}
                  onClick={() => { setPageNumber(p => p + 1); window.scrollTo(0,0); }}
                  className="p-5 rounded-full border bg-white shadow-sm disabled:opacity-20 hover:bg-gray-50 transition-all"
                >
                   <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SalonsPage;