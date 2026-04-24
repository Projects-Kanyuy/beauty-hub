
// // components/Feed.jsx
// import { useEffect, useState } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import VideoCard from "./VideoCard";
// import { API } from "../../api";
// import { toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";

// export default function Feed() {
//   const [videos, setVideos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true);

//   const fetchVideos = async () => {
//     try {
//       const { data } = await API.get(`/api/videos?page=${page}`);

//       if (data.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       setVideos((prev) => [...prev, ...data]);
//       setPage((prev) => prev + 1);
//     } catch (err) {
//       toast.error("Failed to load videos");
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // LOADING SCREEN
//   if (initialLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-100">
//         <ClipLoader size={40} color="#000" />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">

//       <InfiniteScroll
//         dataLength={videos.length}
//         next={fetchVideos}
//         hasMore={hasMore}
//         loader={
//           <div className="flex justify-center py-4">
//             <ClipLoader size={25} />
//           </div>
//         }
//       >
//         {videos.map((v) => (
//           <VideoCard key={v._id} video={v} />
//         ))}
//       </InfiniteScroll>

//     </div>
//   );
// }




// components/Feed.jsx
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "./VideoCard";
import { API } from "../../api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
export default function Feed() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  const pageRef = useRef(1);

const fetchVideos = async () => {
  try {
    const { data } = await API.get(
      `/api/videos?page=${pageRef.current}`
    );

    // ❗ stop duplicate inserts
    setVideos((prev) => {
      const existingIds = new Set(prev.map(v => v._id));
      const filtered = data.filter(v => !existingIds.has(v._id));
      return [...prev, ...filtered];
    });

    pageRef.current += 1;

    if (data.length === 0) setHasMore(false);

  } catch (err) {
    toast.error("Failed to load videos");
  }
};

//   const fetchVideos = async () => {
//     try {
//       const { data } = await API.get(`/api/videos?page=${page}`);

//       if (data.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       setVideos((prev) => [...prev, ...data]);
//       setPage((prev) => prev + 1);
//     } catch {
//       toast.error("Failed to load videos");
//     }
//   };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">

      <InfiniteScroll
        dataLength={videos.length}
        next={fetchVideos}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <ClipLoader size={25} />
          </div>
        }
      >

        <div className="w-full flex flex-col items-center">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>

      </InfiniteScroll>

    </div>
  );
}