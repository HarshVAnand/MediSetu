import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { seedInitialDatabase } from './services/db.js';
import Lenis from 'lenis';

// Initialize Lenis Smooth Scrolling
const initSmoothScroll = () => {
  // Only initialize on desktop/mouse devices to protect mobile accessibility & form inputs
  if (window.innerWidth > 768) {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
};

// Seed database and initialize root
seedInitialDatabase().catch(err => console.error('DB seed error:', err));
initSmoothScroll();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
