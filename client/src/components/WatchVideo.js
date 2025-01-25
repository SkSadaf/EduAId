import React from "react";
import { useParams } from "react-router-dom";

const WatchVideo = () => {
  const { videoId } = useParams();

  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full h-full max-w-6xl">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default WatchVideo;
