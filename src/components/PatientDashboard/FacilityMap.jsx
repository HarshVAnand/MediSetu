import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  INITIAL_FACILITIES, 
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
  Compass, 
  Radio, 
  AlertCircle 
} from 'lucide-react';

export const FacilityMap = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState({
    name: 'Kolar City (Centre)',
    lat: 13.1367,
    lng: 78.1340
  });

  const [radiusKm, setRadiusKm] = useState(60);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilities = getFacilitiesWithinRadius(
    userLocation.lat,
    userLocation.lng,
    radiusKm,
    {
      category: categoryFilter,
      searchQuery
    }
  );

  const currentFacility = selectedFacility || facilities[0] || null;

  const createIcon = (fac) => {
    const isGovt = fac.category === 'Government';
    const color = isGovt ? '#0d9488' : '#0f4c81';

    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
        ">
          <div style="transform: rotate(45deg); color: #fff; font-size: 13px;">${isGovt ? '🏛️' : '🏥'}</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 10,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([userLocation.lat, userLocation.lng], radiusKm <= 25 ? 12 : 10);

    // Clear previous
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (circleRef.current) map.removeLayer(circleRef.current);
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

    // Draw user location & 60km boundary
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({
        className: 'user-pin',
        html: `<div style="width:16px;height:16px;background:#0284c7;border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })
    }).addTo(map);

    circleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: radiusKm * 1000,
      color: '#0d9488',
      fillColor: '#14b8a6',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '5, 8'
    }).addTo(map);

    facilities.forEach(fac => {
      const icon = createIcon(fac);
      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 6px; font-family: inherit; font-size: 12px;">
          <strong style="color: #0f172a; font-size: 13px;">${fac.name}</strong>
          <div style="font-size: 11px; color: #0d9488; margin-top: 2px;">${fac.category} • ${fac.distanceKm} km away</div>
          <div style="font-size: 11px; color: #64748b; margin: 3px 0;">${fac.address}</div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 700;">Free Beds: ${fac.availableBeds}/${fac.totalBeds}</div>
        </div>
      `);

      marker.on('click', () => setSelectedFacility(fac));
      markersRef.current.push(marker);
    });

  }, [userLocation, radiusKm, categoryFilter, searchQuery]);

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>60km Network Map</span>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} color="var(--medical-teal)" />
            <span>Find Government & Private Hospitals Near You</span>
          </h3>
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-input"
            placeholder="Search hospital or doctor specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* LOCATION & RADIUS FILTER CHIPS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'Government', 'Private'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                background: categoryFilter === cat ? 'var(--primary-navy)' : 'var(--bg-page)',
                color: categoryFilter === cat ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78125rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {cat === 'ALL' ? 'All Hospitals' : cat === 'Government' ? '🏛️ Government' : '🏥 Private'}
            </button>
          ))}
        </div>

        {/* Radius Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--text-muted)' }}>Radius:</span>
          {[25, 50, 60, 80].map(km => (
            <button
              key={km}
              onClick={() => setRadiusKm(km)}
              style={{
                background: radiusKm === km ? 'var(--medical-teal)' : '#ffffff',
                color: radiusKm === km ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.55rem',
                fontSize: '0.75rem',
                fontWeight: radiusKm === km ? 800 : 600,
                cursor: 'pointer'
              }}
            >
              {km}km
            </button>
          ))}
        </div>

      </div>

      {/* MAP & HOSPITAL DETAILS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 0.7fr',
        gap: '1.25rem'
      }} className="fac-map-grid">
        
        {/* LEAFLET MAP */}
        <div 
          ref={mapContainerRef}
          style={{
            height: '420px',
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden'
          }}
        />

        {/* DETAILS SIDEBAR */}
        <div style={{
          background: 'var(--bg-page)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {currentFacility ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  {currentFacility.category === 'Government' ? '🏛️ Government' : '🏥 Private'} • {currentFacility.facilityType}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                  {currentFacility.distanceKm} km away
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                {currentFacility.name}
              </h4>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                {currentFacility.address}
              </p>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <div>Available Beds: <strong style={{ color: 'var(--success-green)' }}>{currentFacility.availableBeds}</strong> / {currentFacility.totalBeds}</div>
                <div>ICU Beds Free: <strong>{currentFacility.icuBeds > 0 ? `${currentFacility.availableIcuBeds} / ${currentFacility.icuBeds}` : 'No ICU'}</strong></div>
                <div>Emergency: <strong>{currentFacility.emergency24x7 ? '🚨 Open 24/7' : 'Daytime Hours'}</strong></div>
                <div>Government Scheme: <strong>{currentFacility.ayushmanBharatAccepted ? '✓ Free / Ayushman Bharat' : 'Private Insurance'}</strong></div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                  Doctors on Duty:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem' }}>
                  {currentFacility.doctorsOnDuty.slice(0, 2).map((d, didx) => (
                    <div key={didx}>• <strong>{d.name}</strong> ({d.role})</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)' }}>Select a hospital on the map.</div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <a href={`tel:${currentFacility?.contact || '108'}`} className="btn btn-teal btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
              <Phone size={14} /> Call ({currentFacility?.contact})
            </a>
            <button 
              onClick={() => {
                if (currentFacility) {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${currentFacility.lat},${currentFacility.lng}`, '_blank');
                }
              }} 
              className="btn btn-secondary btn-sm" 
              style={{ flex: 1 }}
            >
              <Navigation size={14} /> Directions
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .fac-map-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
