import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";
import "./App.css";

const videos = [
  {
    id: "bMknfKXIFA8",
    title: "React Tutorial for Beginners",
    channel: "FreeCodeCamp.org",
    views: "1.4M views",
    time: "2 years ago",
    url: "https://www.youtube.com/watch?v=bMknfKXIFA8"
  },
  {
    id: "W6NZfCO5SIk",
    title: "JavaScript Basics in 60 Minutes",
    channel: "Programming with Mosh",
    views: "9.6M views",
    time: "5 years ago",
    url: "https://www.youtube.com/watch?v=W6NZfCO5SIk"
  },
  {
    id: "fBNz5xF-Kx4",
    title: "Node.js Crash Course",
    channel: "Traversy Media",
    views: "2.2M views",
    time: "4 years ago",
    url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4"
  },
  {
    id: "Ke90Tje7VS0",
    title: "React JS Crash Course",
    channel: "Academind",
    views: "3.1M views",
    time: "3 years ago",
    url: "https://www.youtube.com/watch?v=Ke90Tje7VS0"
  }
];

function App() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <h1>YouTube Clone</h1>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search"
            aria-label="Search videos"
          />
          <button type="button">Search</button>
        </div>
      </header>

      <main className="main">
        <section className="player">
          <VideoPlayer video={currentVideo} />
        </section>
        <aside className="sidebar">
          <h2>Up next</h2>
          <VideoList
            videos={videos}
            setVideo={setCurrentVideo}
            currentVideo={currentVideo}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;