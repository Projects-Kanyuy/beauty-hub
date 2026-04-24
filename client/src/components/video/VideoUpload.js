// components/VideoUpload.jsx
import { useState } from "react";
import axios from "axios";
import { API } from "../../api";
import { toast } from "react-toastify";

export default function VideoUpload() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "dw76uqccg";
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET|| "Beauty_vid";


  console.log("Cloudinary Config:", { cloudName, uploadPreset });

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!video) return toast.error("Please select a video");

    try {
      setLoading(true);

      // ☁️ Upload to Cloudinary (FIXED)
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", uploadPreset);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        formData
      );

      // 📡 Send to backend
      await API.post("/api/videos", {
        videoUrl: cloudRes.data.secure_url,
        caption,
      });

      toast.success("Video uploaded successfully 🎉");

      // reset
      setVideo(null);
      setPreview(null);
      setCaption("");
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black p-4">
      <div className="w-full max-w-md bg-zinc-900 text-white rounded-2xl shadow-2xl p-5 border border-zinc-700">

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">
          🎬 Create New Video
        </h2>

        {/* Video Preview */}
        <div className="relative w-full h-60 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-zinc-700">
          {preview ? (
            <video
              src={preview}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-400">No video selected</p>
          )}
        </div>

        {/* File Input */}
        <label className="block mt-4 cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition p-3 rounded-lg text-center text-sm">
          📁 Choose Video
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
          />
        </label>

        {/* Caption */}
        <input
          className="w-full mt-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-pink-500"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full mt-4 py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-600"
              : "bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90"
          }`}
        >
          {loading ? "Uploading..." : "🚀 Upload Video"}
        </button>
      </div>
    </div>
  );
}