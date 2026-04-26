/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Trash2, Play, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { API } from "../../api";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage ONCE
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid userInfo in localStorage");
      }
    }
  }, []);

  const token = user?.token;

  // ✅ Fetch videos only when token is available
  const fetchMyVideos = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/videos/my-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos(res.data.videos || []);
    } catch (err) {
      toast.error("Failed to load your videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyVideos();
    }
  }, [token]);

  // ✅ Delete video
  const handleDelete = async (videoId) => {
    try {
      setDeletingId(videoId);

      await API.delete(`/api/videos/my-videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      toast.success("Video deleted");
    } catch (err) {
      toast.error("Failed to delete video");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-4xl font-bold mb-10 text-center">
          My Videos 🎬
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
          </div>
        ) : videos.length === 0 ? (

          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-xl text-gray-600">
              You haven’t uploaded any videos yet
            </p>
          </div>

        ) : (

          /* Videos Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video._id}
                whileHover={{ scale: 1.03 }}
                className="relative group bg-black rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Video */}
                <video
                  src={video.videoUrl}
                  className="w-full h-64 object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
                  
                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow"
                    >
                      {deletingId === video._id ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>

                  {/* Video Info */}
                  <div>
                    <p className="text-white text-sm line-clamp-2">
                      {video.caption || "No caption"}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-200 mt-2">
                      <span>❤️ {video.likesCount || 0}</span>
                      <span>💬 {video.commentsCount || 0}</span>
                      <span>🔁 {video.sharesCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Play className="text-white opacity-70" size={40} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVideos;