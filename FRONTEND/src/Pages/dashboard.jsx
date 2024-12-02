import React, { useState, useRef } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import './dashboard.css';
import Video1 from '../assets/Videos/Video_1.mp4';
import Video2 from '../assets/Videos/Video_2.mp4';
import Video3 from '../assets/Videos/Video_3.mp4';
import Video4 from '../assets/Videos/Video_4.mp4';
import Video5 from '../assets/Videos/Video_5.mp4';
import Video6 from '../assets/Videos/Video_6.mp4';
import Video7 from '../assets/Videos/Video_7.mp4';
import Video8 from '../assets/Videos/Video_8.mp4';

const Dashboard = () => {
  const [selectedVideo, setSelectedVideo] = useState(Video1);
  const [activeZone, setActiveZone] = useState("Video_1");

  const videoPaths = {
    Video_1: Video1,
    Video_2: Video2,
    Video_3: Video3,
    Video_4: Video4,
    Video_5: Video5,
    Video_6: Video6,
    Video_7: Video7,
    Video_8: Video8 
  };

  const handleVideoSelect = (videoKey) => {
    setSelectedVideo(videoPaths[videoKey]);
    setActiveZone(videoKey);
  };

  const videoRef = useRef(null);
  const videoList = Object.keys(videoPaths);

  return (
    <div className="dashboard-container">
      <div className="column-layout">
        <section className="hotspot-zones">
          <h2>Hotspot Zones</h2>
          <div className="zone-list">
            {videoList.map((videoKey, index) => (
              <div
                key={videoKey}
                className={`zone-item ${activeZone === videoKey ? "active" : ""}`}
                onClick={() => handleVideoSelect(videoKey)}
              >
                <span>{index + 1}. {videoKey.replace("Video_", "Zone ")}</span>
                {activeZone === videoKey ? <FaMinus /> : <FaPlus />}
              </div>
            ))}
          </div>
        </section>

        <section className="camera-feed">
          <div className="feed-header">
            <span>Camera - {activeZone.replace("Video_", "")}</span>
            <span>08/Oct/2024 | 01:00 AM</span>
          </div>
          <div className="feed-content">
            <video
              src={selectedVideo}
              ref={videoRef}
              controls
              className="responsive-video"
            />
          </div>
        </section>
      </div>

      <section className="nearby-areas">
        <h2>Nearby Areas</h2>
        <div className="nearby-grid">
          {videoList.map((videoKey, index) => (
            <video
              key={index}
              src={videoPaths[videoKey]}
              controls
              className="grid-video"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
