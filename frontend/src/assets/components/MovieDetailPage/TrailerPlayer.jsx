import React, { useState, useEffect } from "react";
import { FaPlay, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const TrailerPlayer = ({ isOpen, onClose, trailerUrl, movieTitle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(trailerUrl);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${
        isMuted ? 1 : 0
      }&rel=0&showinfo=0`
    : "";

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Handle ESC key
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsLoading(true);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">
            Trailer - {movieTitle}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMute}
              className="text-white hover:text-red-500 transition-colors p-2"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-red-500 transition-colors p-2"
              title="Đóng"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                <p className="text-white">Đang tải trailer...</p>
              </div>
            </div>
          )}

          {/* Video Player */}
          {embedUrl ? (
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${movieTitle} Trailer`}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <FaPlay className="mx-auto mb-4 text-4xl text-gray-400" />
                <p>Không thể phát trailer</p>
                <p className="text-sm text-gray-400 mt-2">
                  URL trailer không hợp lệ
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center mt-4">
          <div className="bg-gray-800 bg-opacity-80 rounded-full px-6 py-2">
            <p className="text-white text-sm">
              Nhấn ESC hoặc click bên ngoài để đóng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerPlayer;
