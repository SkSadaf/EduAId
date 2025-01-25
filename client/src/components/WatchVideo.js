import React from "react";
import { useParams } from "react-router-dom";

const WatchVideo = () => {
  const { videoId } = useParams();

  return (
    <div className="w-full max-w-4xl aspect-video">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default WatchVideo;
