import React from "react";
import "./VideoList.css";

const VideoList = ({ videos, setVideo, currentVideo }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <button
          type="button"
          key={video.id}
          className={`video-item${
            currentVideo && currentVideo.id === video.id ? " active" : ""
          }`}
          onClick={() => setVideo(video)}
        >
          <img
            className="thumb"
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            loading="lazy"
          />
          <div className="video-info">
            <h4>{video.title}</h4>
            <p>{video.channel}</p>
            <span>
              {video.views} • {video.time}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default VideoList;