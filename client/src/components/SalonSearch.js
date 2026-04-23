// import { useState } from "react";
// import axios from "axios";
// import { API } from "../api";
// const SalonSearch = () => {
//   const [query, setQuery] = useState("");
//   const [salons, setSalons] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const backendUrl = process.env.REACT_APP_API_URL;

//   const handleSearch = async () => {
//     if (!query.trim()) return;

//     try {
//       setLoading(true);
//       const res = await API.get(`api/salons/search?q=${query}`);
     
//    console.log(res.data)
//       setSalons(res.data.salons || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">

//         {/* 🔍 Search Bar */}
//         <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 mb-6">
//           <input
//             type="text"
//             placeholder="Search for services (e.g. Haircut, Braids...)"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="flex-1 px-4 py-3 rounded-xl bg-gray-100 outline-none"
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90"
//           >
//             Search
//           </button>
//         </div>

//         {/* ⏳ Loading */}
//         {loading && (
//           <p className="text-center text-gray-500">Searching salons...</p>
//         )}

//         {/* ❌ Empty */}
//         {!loading && salons.length === 0 && (
//           <p className="text-center text-gray-400">
//             No salons found. Try another service.
//           </p>
//         )}

//         {/* 🏪 Salon List */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {salons.map((salon) => (
//             <div
//               key={salon._id}
//               className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
//             >
//               {/* Image */}
//               <img
//                 src={salon.photos?.[0] || "https://via.placeholder.com/400"}
//                 alt={salon.name}
//                 className="w-full h-48 object-cover"
//               />

//               {/* Content */}
//               <div className="p-4 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <h2 className="font-bold text-lg">{salon.name}</h2>
//                   <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
//                     ⭐ {salon.averageRating.toFixed(1)}
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-500">
//                   {salon.city} • {salon.address}
//                 </p>

//                 {/* Services */}
//                 <div className="flex flex-wrap gap-2">
//                   {salon.services.slice(0, 4).map((service, i) => (
//                     <span
//                       key={i}
//                       className="text-xs bg-gray-100 px-3 py-1 rounded-full"
//                     >
//                       {service.name}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Price Preview */}
//                 {salon.services[0] && (
//                   <p className="text-sm font-semibold text-gray-700">
//                     From {salon.currency} {salon.services[0].price}
//                   </p>
//                 )}

//                 {/* Button */}
//                 <button className="w-full bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90">
//                   View Salon
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalonSearch;










import { useState } from "react";
import { API } from "../api";
import SalonCard from "../components/SalonCard";


const SalonSearch = () => {
  const [query, setQuery] = useState("");
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await API.get(`api/salons/search?q=${query}`);

      console.log(res.data);
      setSalons(res.data.salons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* 🔍 Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Search for services (e.g. Haircut, Braids...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90"
          >
            Search
          </button>
        </div>

        {/* ⏳ Loading */}
        {loading && (
          <p className="text-center text-gray-500">Searching salons...</p>
        )}

        {/* ❌ Empty */}
        {!loading && salons.length === 0 && (
          <p className="text-center text-gray-400">
            No salons found. Try another service.
          </p>
        )}

        {/* 🏪 Salon Grid (REUSING YOUR CARD) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map((salon) => (
            <SalonCard key={salon._id} salon={salon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalonSearch;