import React, { useState } from 'react';
import './Database.css';
import Video1 from '../assets/Videos/Video_1.mp4';
import Video2 from '../assets/Videos/Video_2.mp4';
import Video3 from '../assets/Videos/Video_3.mp4';
import Video4 from '../assets/Videos/Video_4.mp4';
import Video5 from '../assets/Videos/Video_5.mp4';
import Video6 from '../assets/Videos/Video_6.mp4';
import Video7 from '../assets/Videos/Video_7.mp4';
import Video8 from '../assets/Videos/Video_8.mp4';

const Database = () => {
  const videos = [
    { id: 'Airoli', name: 'Video 1', src: Video1 },
    { id: 'Belapur', name: 'Video 2', src: Video2 },
    { id: 'Thane', name: 'Video 3', src: Video3 },
    { id: 'Ulhasnagar', name: 'Video 4', src: Video4 },
    { id: 'Nerul', name: 'Video 5', src: Video5 },
    { id: 'Pune', name: 'Video 6', src: Video6 },
    { id: 'Kalyan', name: 'Video 7', src: Video7 },
    { id: 'Khandala', name: 'Video 8', src: Video8 },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSingleResult = filteredVideos.length === 1;

  return (
    <div>
      <section className="video-section">
        {/* Search Input */}
        <input
          type="text"
          className="search-box"
          placeholder="Search videos by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <h2>All Videos</h2>
        <div className={`video-grid ${isSingleResult ? 'centered-video' : ''}`}>
          {filteredVideos.map((video) => (
            <video
              key={video.id}
              src={video.src}
              controls
              className={`responsive-video ${isSingleResult ? 'large-video' : ''}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Database;
