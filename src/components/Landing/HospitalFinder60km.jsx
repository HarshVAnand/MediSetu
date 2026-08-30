import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  PRESET_REGIONS, 
  getFacilitiesWithinRadius, 
  fetchNearbyHospitalsLive,
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
  ExternalLink,
  RefreshCw,
  Award
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
    name: 'Kolar District & City',
    lat: 13.1367,
    lng: 78.1340,
    isLiveGps: false
  });

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [isLiveFetching, setIsLiveFetching] = useState(false);
  const [liveDataset, setLiveDataset] = useState(null);

  // Filter States (Default radius 60km as requested)
  const [radiusKm, setRadiusKm] = useState(60);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Government' | 'Private'
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [icuOnly, setIcuOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile View Tab: 'split', 'map', or 'list'
  const [mobileViewTab, setMobileViewTab] = useState('split');

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
    },
    liveDataset
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

  // Initialize & Update Leaflet Map
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

    // Update map view & center
    map.setView([userLocation.lat, userLocation.lng], radiusKm <= 25 ? 12 : radiusKm <= 60 ? 10 : 9);

    // Render User Location & 60km Radius Circle
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    if (radiusCircleRef.current) map.removeLayer(radiusCircleRef.current);

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: createUserIcon()
    }).addTo(map);

    userMarkerRef.current.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; padding: 4px;">
        <strong style="color: #0284c7;">📍 Your Location</strong>
        <div>${userLocation.name}</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Searching all hospitals within <strong>${radiusKm} km</strong></div>
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
              <span>Free Beds:</span>
              <strong style="color: #16a34a;">${fac.availableBeds} / ${fac.totalBeds}</strong>
            </div>
            ${fac.icuBeds > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>ICU Beds:</span>
                <strong style="color: #0284c7;">${fac.availableIcuBeds} / ${fac.icuBeds} Free</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between;">
              <span>Emergency:</span>
              <strong>${fac.emergency24x7 ? '<span style="color: #dc2626; font-weight: 700;">🚨 24x7 Ready</span>' : 'Clinic Hours'}</strong>
            </div>
          </div>

          <div style="display: flex; gap: 4px; margin-top: 4px;">
            <a href="tel:${fac.contact}" style="flex: 1; text-align: center; background: #0d9488; color: #ffffff; padding: 5px 6px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none;">
              📞 Call
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #0f4c81; color: #ffffff; padding: 5px 6px; border-radius: 6px; font-size: 10px; font-weight: 700; text-decoration: none;">
              🗺️ Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedHospitalId(fac.id);
      });
    });

  }, [userLocation, radiusKm, categoryFilter, emergencyOnly, icuOnly, searchQuery, selectedHospitalId, liveDataset]);

  // GPS Geolocation Handler with Live Overpass fetch
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('GPS location is not supported in your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          name: 'Your Live GPS Location',
          lat: latitude,
          lng: longitude,
          isLiveGps: true
        });
        setIsLocating(false);

        // Fetch live OpenStreetMap hospitals for this exact coordinate
        setIsLiveFetching(true);
        const live = await fetchNearbyHospitalsLive(latitude, longitude, radiusKm);
        if (live && live.length > 0) {
          setLiveDataset(live);
        } else {
          setLiveDataset(null);
        }
        setIsLiveFetching(false);
      },
      (error) => {
        console.warn('Geolocation warning/denied:', error);
        setGeoError('Could not fetch exact GPS. Select a nearby city preset.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Preset location select
  const handleSelectPresetRegion = async (region) => {
    setUserLocation({
      name: region.name,
      lat: region.lat,
      lng: region.lng,
      isLiveGps: false
    });
    setGeoError(null);

    // Fetch live data for selected preset
    setIsLiveFetching(true);
    const live = await fetchNearbyHospitalsLive(region.lat, region.lng, radiusKm);
    if (live && live.length > 0) {
      setLiveDataset(live);
    } else {
      setLiveDataset(null);
    }
    setIsLiveFetching(false);
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
        
        {/* SECTION HEADER - CENTER ALIGNED */}
        <div className="section-center-header">
          
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

          <p style={{ fontSize: '1.025rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '720px', margin: '0 auto' }}>
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

            {/* 2. Radius Selector (60km Default & Highlighted) */}
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
                        backgroundColor: isSelected ? 'var(--primary-navy)' : is60 ? 'var(--medical-teal-subtle)' : '#ffffff',
                        color: isSelected ? '#ffffff' : is60 ? 'var(--medical-teal-dark)' : 'var(--text-muted)',
                        border: isSelected ? '1px solid var(--primary-navy)' : is60 ? '1px solid var(--medical-teal)' : '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        textAlign: 'center'
                      }}
                    >
                      {km} km {is60 && '⭐'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Search by Name, Doctor, or Facility */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.45rem' }}>
                <Search size={15} color="var(--medical-teal)" />
                <span>Search Hospital or Specialty:</span>
              </label>

              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder="e.g. Heart, District, Delivery, ICU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{
                    paddingLeft: '2.25rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)'
                  }}
                />
                <Search 
                  size={15} 
                  color="var(--text-subtle)" 
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} 
                />
              </div>
            </div>

          </div>

          {/* SECONDARY FILTER CHIPS: ALL / GOVT / PRIVATE / EMERGENCY / ICU */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '0.25rem' }}>
                Filter By Type:
              </span>

              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`btn btn-sm ${categoryFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                All Hospitals ({hospitals.length})
              </button>

              <button
                onClick={() => setCategoryFilter('Government')}
                className={`btn btn-sm ${categoryFilter === 'Government' ? 'btn-teal' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                🏛️ Government Only
              </button>

              <button
                onClick={() => setCategoryFilter('Private')}
                className={`btn btn-sm ${categoryFilter === 'Private' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                🏥 Private Only
              </button>

              <button
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: emergencyOnly ? '1px solid #ef4444' : '1px solid var(--border-medium)',
                  backgroundColor: emergencyOnly ? '#fef2f2' : '#ffffff',
                  color: emergencyOnly ? '#dc2626' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🚨 24/7 Emergency Ready</span>
                {emergencyOnly && <span>✓</span>}
              </button>

              <button
                onClick={() => setIcuOnly(!icuOnly)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: icuOnly ? '1px solid #0284c7' : '1px solid var(--border-medium)',
                  backgroundColor: icuOnly ? '#f0f9ff' : '#ffffff',
                  color: icuOnly ? '#0369a1' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>🛏️ ICU Available</span>
                {icuOnly && <span>✓</span>}
              </button>
            </div>

            {/* Total count indicator */}
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Found <strong>{hospitals.length} hospitals</strong> within {radiusKm} km
            </div>
          </div>

        </div>

        {/* MOBILE VIEW TOGGLE TABS (Map vs List) */}
        <div className="mobile-view-tabs" style={{ display: 'none', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', width: '100%', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
            <button
              onClick={() => setMobileViewTab('list')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mobileViewTab === 'list' ? '#ffffff' : 'transparent',
                color: mobileViewTab === 'list' ? 'var(--primary-navy)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: mobileViewTab === 'list' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              📋 Hospital List ({hospitals.length})
            </button>

            <button
              onClick={() => setMobileViewTab('map')}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: mobileViewTab === 'map' ? '#ffffff' : 'transparent',
                color: mobileViewTab === 'map' ? 'var(--medical-teal-dark)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: mobileViewTab === 'map' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              🗺️ Interactive Map
            </button>
          </div>
        </div>

        {/* MAIN 2-COLUMN VIEW: MAP + HOSPITAL LIST */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 0.95fr',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="finder-grid-container">
          
          {/* LEFT: LEAFLET INTERACTIVE MAP */}
          <div className={`map-wrapper-col ${mobileViewTab === 'list' ? 'mobile-hidden' : ''}`} style={{
            position: 'sticky',
            top: '85px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-medium)',
            padding: '0.75rem',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            
            {/* Map Header Status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.5rem',
              background: 'var(--bg-page)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78125rem',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
                <span><strong>Live GPS Active:</strong> {userLocation.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏛️ Govt Teal</span>
                <span>•</span>
                <span>🏥 Pvt Navy</span>
              </div>
            </div>

            {/* Map Container */}
            <div 
              ref={mapContainerRef} 
              style={{
                width: '100%',
                height: '560px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                zIndex: 10
              }}
              className="leaflet-responsive-container"
            />
          </div>

          {/* RIGHT: SCROLLABLE HOSPITALS CARDS LIST */}
          <div 
            ref={listContainerRef}
            className={`list-wrapper-col ${mobileViewTab === 'map' ? 'mobile-hidden' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '640px',
              overflowY: 'auto',
              paddingRight: '0.35rem'
            }}
          >
            {hospitals.length === 0 ? (
              <div className="med-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                <AlertCircle size={36} color="var(--warning-amber)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                  No Hospitals Found In This Radius
                </h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Try increasing your search radius to <strong>60 km</strong> or clearing active search filters.
                </p>
                <button
                  onClick={() => { setRadiusKm(60); setCategoryFilter('ALL'); setEmergencyOnly(false); setIcuOnly(false); setSearchQuery(''); }}
                  className="btn btn-teal btn-sm"
                >
                  Reset to 60km All Hospitals
                </button>
              </div>
            ) : (
              hospitals.map((fac) => {
                const isSelected = fac.id === selectedHospitalId;
                const isGovt = fac.category === 'Government';

                return (
                  <div
                    key={fac.id}
                    onClick={() => {
                      setSelectedHospitalId(fac.id);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView([fac.lat, fac.lng], 13, { animate: true });
                      }
                    }}
                    className={`med-card interactive ${isSelected ? 'selected-hospital-card' : ''}`}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: isSelected ? '2px solid var(--medical-teal)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--medical-teal-subtle)' : '#ffffff',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    
                    {/* CARD TOP ROW: CATEGORY BADGE & DISTANCE */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span 
                          className="badge" 
                          style={{
                            backgroundColor: isGovt ? '#f0fdfa' : '#f0f9ff',
                            color: isGovt ? '#0f766e' : '#0369a1',
                            border: `1px solid ${isGovt ? '#99f6e4' : '#bae6fd'}`,
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}
                        >
                          {isGovt ? '🏛️ Government Hospital' : '🏥 Private Hospital'}
                        </span>
                        
                        {fac.ayushmanBharatAccepted && (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            ✓ Ayushman Free Scheme
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        color: 'var(--medical-teal-dark)',
                        background: '#ffffff',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-medium)'
                      }}>
                        📍 {fac.distanceKm} km away
                      </div>
                    </div>

                    {/* HOSPITAL NAME & ADDRESS */}
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      color: 'var(--primary-navy-dark)',
                      marginBottom: '0.25rem',
                      lineHeight: 1.3
                    }}>
                      {fac.name}
                    </h3>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="var(--text-subtle)" style={{ flexShrink: 0 }} />
                      <span>{fac.address}</span>
                    </div>

                    {/* BEDS & EMERGENCY STATUS STRIP */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.5rem',
                      background: isSelected ? '#ffffff' : 'var(--bg-page)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.75rem',
                      border: '1px solid var(--border-light)',
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Free Beds</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--success-green)' }}>
                          {fac.availableBeds} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {fac.totalBeds}</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 600 }}>ICU Beds</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                          {fac.availableIcuBeds} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {fac.icuBeds}</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Emergency</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: fac.emergency24x7 ? 'var(--urgent-red)' : 'var(--text-main)' }}>
                          {fac.emergency24x7 ? '🚨 24x7' : 'Day OPD'}
                        </div>
                      </div>
                    </div>

                    {/* DOCTORS ON DUTY */}
                    {fac.doctorsOnDuty && fac.doctorsOnDuty.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Stethoscope size={13} color="var(--medical-teal)" style={{ flexShrink: 0 }} />
                        <span><strong>Specialists on duty:</strong> {fac.doctorsOnDuty.map(d => `${d.name} (${d.role})`).join(' • ')}</span>
                      </div>
                    )}

                    {/* ACTION BUTTONS: CALL NOW + GET DIRECTIONS */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <a
                        href={`tel:${fac.contact}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-teal btn-sm"
                        style={{ flex: 1, textDecoration: 'none', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                      >
                        <Phone size={14} />
                        <span>Call ({fac.contact})</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, textDecoration: 'none', fontSize: '0.8125rem', padding: '0.45rem 0.75rem' }}
                      >
                        <Navigation size={14} />
                        <span>Get Directions</span>
                      </a>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* STYLES FOR RESPONSIVE BEHAVIOR */}
      <style>{`
        @media (max-width: 900px) {
          .finder-grid-container {
            grid-template-columns: 1fr !important;
          }
          .mobile-view-tabs {
            display: block !important;
          }
          .mobile-hidden {
            display: none !important;
          }
          .map-wrapper-col {
            position: relative !important;
            top: 0 !important;
          }
          .leaflet-responsive-container {
            height: 380px !important;
          }
        }
      `}</style>
    </section>
  );
};
