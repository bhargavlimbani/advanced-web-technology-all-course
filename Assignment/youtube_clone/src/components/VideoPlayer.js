import React from "react";
import "./VideoPlayer.css";

const VideoPlayer = ({ video }) => {
  if (!video) return null;

  return (
    <div className="video-container">
      <div className="player-frame">
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="video-meta">
        <h3>{video.title}</h3>
        <p>
          {video.channel} � {video.views} � {video.time}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;