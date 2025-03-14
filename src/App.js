import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, speed);
    }
    return () => clearInterval(timer);
  }, [playing, speed, images.length]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imagePaths = files.filter(file => file.type === 'image/jpeg').map(file => URL.createObjectURL(file));
    setImages(imagePaths);
    setIndex(0);
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const clearImages = () => {
    setImages([]);
    setIndex(0);
    setPlaying(false);
  };

  const handleProgressClick = (event) => {
    const progressBar = event.target;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newIndex = Math.floor((clickX / rect.width) * images.length);
    setIndex(newIndex);
  };

  const toggleFullscreen = () => {
    const imgElement = document.querySelector('img');
    if (!document.fullscreenElement) {
      imgElement.requestFullscreen();
      imgElement.classList.add('fullscreen');
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const imgElement = document.querySelector('img');
      if (!document.fullscreenElement) {
        imgElement.classList.remove('fullscreen');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="App" onDrop={handleDrop} onDragOver={handleDragOver}>
      {images.length === 0 && (
        <div className="drop-zone">
          Drag and drop your images here
        </div>
      )}
      {images.length > 0 && (
        <>
          <img src={images[index]} alt="Timelapse" />
          <div className="progress-container">
            <progress value={index + 1} max={images.length} onClick={handleProgressClick}></progress>
            <div className="progress-info">
              <input type="text" value={index + 1} readOnly /> / <input type="text" value={images.length} readOnly />
            </div>
          </div>
          <div className="controls">
            <button onClick={prevImage}>Previous</button>
            <button onClick={() => setPlaying(true)}>Play</button>
            <button onClick={() => setPlaying(false)}>Pause</button>
            <button onClick={nextImage}>Next</button>
            <input
              type="range"
              min="100"
              max="2000"
              value={2000 - speed}
              onChange={(e) => setSpeed(2000 - Number(e.target.value))}
            />
            <span>{2000 - speed}</span>
            <button onClick={clearImages}>Clear</button>
            <button onClick={toggleFullscreen}>Fullscreen</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;