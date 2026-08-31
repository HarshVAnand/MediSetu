import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { seedInitialDatabase } from './services/db.js';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scrolling and link with GSAP Ticker
const initLenisSmoothScroll = () => {
  try {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Hook Lenis into GSAP's internal RAF ticker for 60fps / 120fps sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    window.lenis = lenis;
  } catch (err) {
    console.warn('Lenis smooth scroll fallback:', err);
  }
};

// Seed sample patient & doctor database and start smooth scrolling
seedInitialDatabase().catch((err) => console.error('DB seed error:', err));
initLenisSmoothScroll();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

