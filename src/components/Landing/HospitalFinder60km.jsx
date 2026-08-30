import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  PRESET_REGIONS, 
  getFacilitiesWithinRadius, 
  calculateDistance 
} from '../../services/facilityData.js';
import { 
  MapPin, 
  Phone, 
  Bed, 
  Stethoscope, 
  Search, 
  Navigation, 
  Building2, 
  ShieldCheck, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  Radio, 
  Filter, 
  Sliders, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import gsap from 'gsap';

export const HospitalFinder60km = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const userMarkerRef = useRef(null);
  const listContainerRef = useRef(null);

  // User Geolocation State (Default to Kolar Central)
  const [userLocation, setUserLocation] = useState({
    name: 'Kolar City (Centre)',
    lat: 13.1367,
    lng: 78.1340,
    isLiveGps: false
  });

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Filter States (Default radius 60km as requested)
  const [radiusKm, setRadiusKm] = useState(60);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Government' | 'Private'
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [icuOnly, setIcuOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile View Tab: 'map' or 'list'
  const [mobileViewTab, setMobileViewTab] = useState('split'); // 'split' | 'map' | 'list'

  // Selected Hospital for Sidebar / Modal highlight
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);

  // Computed Facilities based on radius, location, and filters
  const hospitals = getFacilitiesWithinRadius(
    userLocation.lat,
    userLocation.lng,
    radiusKm,
    {
      category: categoryFilter,
      emergencyOnly,
      icuOnly,
      searchQuery
    }
  );

  const selectedHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0] || null;

  // Custom Icon Generator
  const createHospitalIcon = (fac, isSelected = false) => {
    const isGovt = fac.category === 'Government';
    const isEmergency = fac.emergency24x7;
    const baseColor = isGovt ? '#0d9488' : '#0f4c81'; // Teal for Govt, Navy for Private
    const pinSize = isSelected ? 38 : 32;

    return L.divIcon({
      className: 'custom-hospital-pin',
      html: `
        <div style="
          position: relative;
          background-color: ${baseColor};
          width: ${pinSize}px;
          height: ${pinSize}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${isSelected ? '0 0 0 4px #facc15, 0 8px 16px rgba(0,0,0,0.35)' : '0 4px 10px rgba(0,0,0,0.25)'};
          border: 2px solid #ffffff;
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          <div style="
            transform: rotate(45deg);
            color: #ffffff;
            font-weight: 800;
            font-size: ${pinSize > 32 ? '14px' : '12px'};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${isGovt ? '🏛️' : '🏥'}
          </div>
          ${isEmergency ? `
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 10px;
              height: 10px;
              background-color: #ef4444;
              border-radius: 50%;
              border: 1.5px solid #ffffff;
              box-shadow: 0 0 6px #ef4444;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [pinSize, pinSize],
      iconAnchor: [pinSize / 2, pinSize],
      popupAnchor: [0, -pinSize]
    });
  };

  // User location marker
  const createUserIcon = () => {
    return L.divIcon({
      className: 'user-pulse-pin',
      html: `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; background: rgba(2, 132, 199, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; background: #0284c7; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 10,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Update center
    map.setView([userLocation.lat, userLocation.lng], radiusKm <= 25 ? 12 : radiusKm <= 60 ? 10 : 9);

    // Render User Location & 60km Radius Circle
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    if (radiusCircleRef.current) map.removeLayer(radiusCircleRef.current);

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: createUserIcon()
    }).addTo(map);
    userMarkerRef.current.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 4px;">
        <strong style="color: #0284c7;">📍 Your Selected Location</strong>
        <div>${userLocation.name}</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Showing hospitals within <strong>${radiusKm} km</strong></div>
      </div>
    `);

    // Draw the 60km radius boundary circle
    radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: radiusKm * 1000,
      color: '#0d9488',
      fillColor: '#14b8a6',
      fillOpacity: 0.07,
      weight: 2,
      dashArray: '5, 8'
    }).addTo(map);

    // Clear old hospital markers
    markersGroupRef.current.clearLayers();

    // Render Hospital Pins
    hospitals.forEach(fac => {
      const isSelected = fac.id === selectedHospitalId;
      const marker = L.marker([fac.lat, fac.lng], {
        icon: createHospitalIcon(fac, isSelected)
      }).addTo(markersGroupRef.current);

      const isGovt = fac.category === 'Government';
      const popupContent = `
        <div style="font-family: inherit; padding: 6px; max-width: 250px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="background: ${isGovt ? '#f0fdfa' : '#f0f9ff'}; color: ${isGovt ? '#0f766e' : '#0369a1'}; border: 1px solid ${isGovt ? '#99f6e4' : '#bae6fd'}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 999px;">
              ${isGovt ? '🏛️ Government' : '🏥 Private'}
            </span>
            <span style="font-size: 11px; font-weight: 800; color: #0d9488;">
              ${fac.distanceKm} km away
            </span>
          </div>

          <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 4px;">
            ${fac.name}
          </div>

          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${fac.address}
          </div>

          <div style="background: #f8fafc; border-radius: 6px; padding: 6px; font-size: 11px; margin-bottom: 6px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Available Beds:</span>
              <strong style="color: #16a34a;">${fac.availableBeds} / ${fac.totalBeds}</strong>
            </div>
            ${fac.icuBeds > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>ICU Beds Free:</span>
                <strong style="color: #0284c7;">${fac.availableIcuBeds} / ${fac.icuBeds}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span>Emergency:</span>
              <strong>${fac.emergency24x7 ? '<span style="color: #dc2626; font-weight: 700;">🚨 24x7 Ready</span>' : 'Regular Hours'}</strong>
            </div>
          </div>

          <a href="tel:${fac.contact}" style="display: block; text-align: center; background: #0d9488; color: #ffffff; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none; margin-top: 4px;">
            📞 Call Now (${fac.contact})
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedHospitalId(fac.id);
      });
    });

  }, [userLocation, radiusKm, categoryFilter, emergencyOnly, icuOnly, searchQuery, selectedHospitalId]);

  // GPS Geolocation Handler
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('GPS location is not supported in your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          name: 'Your Current Live Location (GPS)',
          lat: latitude,
          lng: longitude,
          isLiveGps: true
        });
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation warning/denied:', error);
        setGeoError('Could not fetch exact GPS. Using closest town preset.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset location select
  const handleSelectPresetRegion = (region) => {
    setUserLocation({
      name: region.name,
      lat: region.lat,
      lng: region.lng,
      isLiveGps: false
    });
    setGeoError(null);
  };

  return (
    <section 
      id="facilities"
      style={{
        padding: '5rem 0 5.5rem 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--medical-teal-subtle)',
            border: '1px solid #99f6e4',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            color: 'var(--medical-teal-dark)',
            fontWeight: 700,
            marginBottom: '0.85rem'
          }}>
            <MapPin size={15} color="var(--medical-teal)" />
            <span>60km Radius Local Hospital Finder</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Find All Private & Government Hospitals Near You
          </h2>

          <p style={{ fontSize: '1.025rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
            Instantly discover every hospital, clinic, and 24/7 emergency centre within <strong>60 km</strong> of your location. Check real-time free beds, on-duty doctors, and government scheme availability.
          </p>
        </div>

        {/* CONTROLS CARD: LOCATION & RADIUS FILTER */}
        <div className="med-card" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center'
          }}>
            
            {/* 1. Location Detection & Region Switcher */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.45rem' }}>
                <Compass size={15} color="var(--medical-teal)" />
                <span>Your Location:</span>
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  id="btn-detect-gps-location"
                  onClick={handleDetectLiveLocation}
                  disabled={isLocating}
                  className="btn btn-teal btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8125rem',
                    padding: '0.55rem 0.95rem'
                  }}
                  title="Detect GPS location from device"
                >
                  <MapPin size={14} className={isLocating ? 'spin-anim' : ''} />
                  <span>{isLocating ? 'Detecting...' : '📍 Use Live GPS'}</span>
                </button>

                <select 
                  className="form-input"
                  style={{
                    flex: 1,
                    minWidth: '160px',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: '#ffffff'
                  }}
                  value={PRESET_REGIONS.find(r => r.name === userLocation.name)?.id || 'custom'}
                  onChange={(e) => {
                    const found = PRESET_REGIONS.find(r => r.id === e.target.value);
                    if (found) handleSelectPresetRegion(found);
                  }}
                >
                  {PRESET_REGIONS.map(r => (
                    <option key={r.id} value={r.id}>
                      📍 {r.name}
                    </option>
                  ))}
                  {userLocation.isLiveGps && (
                    <option value="custom">📍 My Live GPS Location</option>
                  )}
                </select>
              </div>

              {geoError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--warning-amber)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertCircle size={12} />
                  <span>{geoError}</span>
                </div>
              )}
            </div>

            {/* 2. Radius Selector (60km Default & Emphasized) */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.45rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Radio size={15} color="var(--medical-teal)" />
                  <span>Search Radius:</span>
                </span>
                <span style={{ color: 'var(--medical-teal-dark)', fontWeight: 800, background: 'var(--medical-teal-subtle)', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid #99f6e4' }}>
                  {radiusKm} km radius
                </span>
              </label>

              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[10, 25, 50, 60, 80].map(km => {
                  const is60 = km === 60;
                  const isSelected = radiusKm === km;
                  return (
                    <button
                      key={km}
                      onClick={() => setRadiusKm(km)}
                      style={{
                        flex: 1,
                        minWidth: '50px',
                        padding: '0.45rem 0.4rem',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 800 : 600,
                        backgroundColor: isSelected ? 'var(--primary-navy)' : '#ffffff',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        border: isSelected ? '1px solid var(--primary-navy)' : '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                      }}
                    >
                      {km} km
                      {is60 && (
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-4px',
                          backgroundColor: '#14b8a6',
                          color: '#ffffff',
                          fontSize: '0.55rem',
                          fontWeight: 800,
                          padding: '1px 4px',
                          borderRadius: '4px',
                          lineHeight: 1
                        }}>
                          RECOMMENDED
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Search Bar by Hospital Name or Doctor Specialty */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.45rem' }}>
                <Search size={15} color="var(--medical-teal)" />
                <span>Search Hospital or Specialty:</span>
              </label>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Heart, Delivery, General, SNR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 2rem',
                    fontSize: '0.8125rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: '#ffffff'
                  }}
                />
                <Search size={14} color="var(--text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

          </div>

          {/* QUICK CATEGORY FILTER CHIPS */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategoryFilter('ALL')}
                style={{
                  background: categoryFilter === 'ALL' ? 'var(--medical-teal)' : '#ffffff',
                  color: categoryFilter === 'ALL' ? '#ffffff' : 'var(--text-main)',
                  border: `1px solid ${categoryFilter === 'ALL' ? 'var(--medical-teal)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                All Hospitals ({hospitals.length})
              </button>

              <button
                onClick={() => setCategoryFilter('Government')}
                style={{
                  background: categoryFilter === 'Government' ? 'var(--medical-teal)' : '#ffffff',
                  color: categoryFilter === 'Government' ? '#ffffff' : 'var(--text-main)',
                  border: `1px solid ${categoryFilter === 'Government' ? 'var(--medical-teal)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>🏛️ Government Hospitals Only</span>
              </button>

              <button
                onClick={() => setCategoryFilter('Private')}
                style={{
                  background: categoryFilter === 'Private' ? 'var(--primary-navy)' : '#ffffff',
                  color: categoryFilter === 'Private' ? '#ffffff' : 'var(--text-main)',
                  border: `1px solid ${categoryFilter === 'Private' ? 'var(--primary-navy)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>🏥 Private Hospitals Only</span>
              </button>
            </div>

            {/* TOGGLE 24x7 EMERGENCY & ICU */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                style={{
                  background: emergencyOnly ? '#fee2e2' : '#ffffff',
                  color: emergencyOnly ? '#dc2626' : 'var(--text-muted)',
                  border: `1px solid ${emergencyOnly ? '#f87171' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <AlertCircle size={14} color="#dc2626" />
                <span>🚨 24/7 Emergency Care</span>
              </button>

              <button
                onClick={() => setIcuOnly(!icuOnly)}
                style={{
                  background: icuOnly ? 'var(--accent-cyan-subtle)' : '#ffffff',
                  color: icuOnly ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  border: `1px solid ${icuOnly ? 'var(--accent-cyan-border)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Bed size={14} />
                <span>🛏️ ICU Beds Free</span>
              </button>
            </div>

          </div>
        </div>

        {/* MOBILE VIEW TOGGLE: MAP VS LIST */}
        <div className="mobile-view-tabs" style={{ display: 'none', marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            width: '100%',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            border: '1px solid var(--border-medium)'
          }}>
            <button
              onClick={() => setMobileViewTab('map')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mobileViewTab === 'map' || mobileViewTab === 'split' ? '#ffffff' : 'transparent',
                fontWeight: 700,
                fontSize: '0.8125rem',
                color: 'var(--primary-navy)'
              }}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setMobileViewTab('list')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mobileViewTab === 'list' ? '#ffffff' : 'transparent',
                fontWeight: 700,
                fontSize: '0.8125rem',
                color: 'var(--primary-navy)'
              }}
            >
              📋 Hospital List ({hospitals.length})
            </button>
          </div>
        </div>

        {/* MAIN MAP & HOSPITAL CARDS SPLIT LAYOUT */}
        <div 
          className="hospital-finder-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: '1.5rem',
            alignItems: 'start'
          }}
        >
          
          {/* LEFT: INTERACTIVE LEAFLET MAP */}
          <div 
            className={`map-column ${mobileViewTab === 'list' ? 'hide-on-mobile' : ''}`}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-medium)',
              padding: '0.75rem',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <div 
              ref={mapContainerRef}
              style={{
                height: '560px',
                width: '100%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                zIndex: 10
              }}
            />

            {/* Map Legend Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              zIndex: 400,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(6px)',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.15rem' }}>
                Map Legend (Within {radiusKm}km):
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#0d9488', borderRadius: '50%' }}></span>
                <span>🏛️ Government Hospital</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#0f4c81', borderRadius: '50%' }}></span>
                <span>🏥 Private Hospital</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></span>
                <span>🚨 24/7 Emergency Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#0284c7', borderRadius: '50%' }}></span>
                <span>📍 Your Location ({radiusKm}km Circle)</span>
              </div>
            </div>
          </div>

          {/* RIGHT: SCROLLABLE HOSPITALS DIRECTORY LIST */}
          <div 
            className={`list-column ${mobileViewTab === 'map' ? 'hide-on-mobile' : ''}`}
            ref={listContainerRef}
            style={{
              maxHeight: '580px',
              overflowY: 'auto',
              paddingRight: '0.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                {hospitals.length} Hospitals Found within {radiusKm} km
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Sorted by closest distance
              </div>
            </div>

            {hospitals.length === 0 ? (
              <div style={{
                background: 'var(--bg-page)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                border: '1px solid var(--border-light)'
              }}>
                <AlertCircle size={32} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontSize: '1rem', color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                  No hospitals matched your exact filter
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Try widening your radius to 60km or 80km, or resetting your filter tabs.
                </p>
                <button 
                  onClick={() => { setRadiusKm(60); setCategoryFilter('ALL'); setEmergencyOnly(false); setIcuOnly(false); setSearchQuery(''); }}
                  className="btn btn-secondary btn-sm"
                >
                  Reset All Filters to 60km Default
                </button>
              </div>
            ) : (
              hospitals.map(fac => {
                const isSelected = fac.id === selectedHospitalId;
                const isGovt = fac.category === 'Government';

                return (
                  <div
                    key={fac.id}
                    id={`hospital-card-${fac.id}`}
                    onClick={() => {
                      setSelectedHospitalId(fac.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([fac.lat, fac.lng], 13);
                      }
                    }}
                    className="med-card interactive"
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--medical-teal)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? '#f0fdfa' : '#ffffff',
                      boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {/* TOP BADGES */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: isGovt ? '#f0fdfa' : '#f0f9ff',
                          color: isGovt ? '#0f766e' : '#0369a1',
                          border: `1px solid ${isGovt ? '#99f6e4' : '#bae6fd'}`,
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {isGovt ? '🏛️ Government' : '🏥 Private'} • {fac.facilityType}
                        </span>

                        {fac.ayushmanBharatAccepted && (
                          <span style={{
                            background: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)'
                          }}>
                            ✓ Free Care / Ayushman Bharat
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: 'var(--medical-teal-dark)',
                        whiteSpace: 'nowrap'
                      }}>
                        {fac.distanceKm} km away
                      </div>
                    </div>

                    {/* HOSPITAL NAME */}
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--primary-navy-dark)',
                      marginBottom: '0.25rem',
                      lineHeight: 1.3
                    }}>
                      {fac.name}
                    </h3>

                    {/* ADDRESS */}
                    <p style={{
                      fontSize: '0.78125rem',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.35rem'
                    }}>
                      <MapPin size={13} color="var(--text-subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{fac.address}</span>
                    </p>

                    {/* BEDS & EMERGENCY STATS */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.78125rem',
                      border: '1px solid var(--border-light)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-subtle)' }}>Available Beds: </span>
                        <strong style={{ color: '#16a34a' }}>{fac.availableBeds}</strong> / {fac.totalBeds}
                      </div>

                      <div>
                        <span style={{ color: 'var(--text-subtle)' }}>ICU Beds Free: </span>
                        <strong>{fac.icuBeds > 0 ? `${fac.availableIcuBeds} free` : 'No ICU'}</strong>
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: 'var(--text-subtle)' }}>Emergency: </span>
                        <strong>{fac.emergency24x7 ? '🚨 Open 24/7 for Emergencies' : 'Standard Daytime Clinic'}</strong>
                      </div>
                    </div>

                    {/* DOCTORS ON DUTY */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: '0.71875rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
                        Doctors Available Right Now:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {fac.doctorsOnDuty.slice(0, 2).map((doc, didx) => (
                          <div key={didx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ color: 'var(--medical-teal)', fontWeight: 700 }}>•</span>
                            <span><strong>{doc.name}</strong> — {doc.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`tel:${fac.contact}`}
                        className="btn btn-teal btn-sm"
                        style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.78125rem', textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={13} />
                        <span>Call ({fac.contact})</span>
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`;
                          window.open(url, '_blank');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.78125rem' }}
                      >
                        <Navigation size={13} />
                        <span>Directions</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

      </div>

      {/* STYLES FOR RESPONSIVENESS & ANIMATIONS */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .hospital-finder-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-view-tabs {
            display: block !important;
          }
          .hide-on-mobile {
            display: none !important;
          }
          .list-column {
            max-height: none !important;
          }
        }
      `}</style>
    </section>
  );
};
