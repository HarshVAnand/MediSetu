import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { INITIAL_FACILITIES, FACILITY_TIERS } from '../../services/facilityData.js';
import { MapPin, Phone, Bed, Stethoscope, Filter, Navigation } from 'lucide-react';

export const MapPreview = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);

  // SVG Marker Generator
  const createCustomIcon = (tier, type) => {
    let color = '#0d9488'; // Teal for PHC
    if (type === 'District Hospital') color = '#0f4c81'; // Navy
    else if (type === 'CHC') color = '#0284c7'; // Blue
    else if (type === 'Sub-Centre') color = '#16a34a'; // Green
    else if (type === 'Tertiary Medical College') color = '#7c3aed'; // Purple

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
          <div style="
            transform: rotate(45deg);
            color: #ffffff;
            font-weight: 800;
            font-size: 13px;
          ">+</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean existing map instance if any
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.1332, 78.1388],
        zoom: 11,
        scrollWheelZoom: false
      });

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Filter facilities based on selected tier
    const filtered = selectedTier === 'ALL' 
      ? INITIAL_FACILITIES 
      : INITIAL_FACILITIES.filter(f => f.type.toLowerCase().includes(selectedTier.toLowerCase()));

    filtered.forEach(fac => {
      const icon = createCustomIcon(fac.tier, fac.type);
      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="padding: 10px; font-family: inherit; max-width: 240px;">
          <div style="font-size: 11px; font-weight: 700; color: #0d9488; text-transform: uppercase;">
            ${fac.type} • ${fac.distanceKm} km away
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 3px 0 6px 0;">
            ${fac.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${fac.address}
          </div>
          <div style="font-size: 11px; display: flex; justify-content: space-between; font-weight: 600;">
            <span>Available Beds: <strong style="color: #16a34a;">${fac.availableBeds}</strong>/${fac.totalBeds}</span>
            <span>${fac.emergency24x7 ? '<span style="color: #dc2626;">24x7 ER</span>' : 'OPD'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedFacility(fac);
      });

      markersRef.current.push(marker);
    });

  }, [selectedTier]);

  return (
    <section 
      id="facilities"
      style={{
        padding: '5rem 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-teal" style={{ marginBottom: '0.75rem' }}>
            OpenStreetMap & Leaflet.js
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem'
          }}>
            District Healthcare Facility Discovery Network
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Real-time geospatial mapping of village sub-centres, primary health centres, community health centres, and district trauma hospitals with live bed availability and on-duty doctors.
          </p>
        </div>

        {/* MAP & DETAILS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 0.6fr',
          gap: '1.5rem',
          background: 'var(--bg-page)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          {/* MAP COLUMN */}
          <div>
            {/* TIER FILTER BUTTONS */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.85rem'
            }}>
              {['ALL', 'PHC', 'CHC', 'District Hospital', 'Sub-Centre'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  style={{
                    background: selectedTier === tier ? 'var(--primary-navy)' : '#ffffff',
                    color: selectedTier === tier ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tier === 'ALL' ? 'All Facilities' : tier}
                </button>
              ))}
            </div>

            {/* LEAFLET MAP CONTAINER */}
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
          </div>

          {/* FACILITY DETAILS PANEL */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {selectedFacility ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                    {selectedFacility.type}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                    {selectedFacility.distanceKm} km away
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                  {selectedFacility.name}
                </h3>

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {selectedFacility.address}
                </p>

                {/* KEY STATS */}
                <div style={{
                  background: 'var(--bg-page)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.8125rem'
                }}>
                  <div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>Total / Vacant Beds</div>
                    <strong style={{ color: 'var(--success-green)', fontSize: '0.95rem' }}>
                      {selectedFacility.availableBeds} / {selectedFacility.totalBeds} Available
                    </strong>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.7rem' }}>Emergency Status</div>
                    <strong style={{ color: selectedFacility.emergency24x7 ? 'var(--urgent-red)' : 'var(--text-main)', fontSize: '0.875rem' }}>
                      {selectedFacility.emergency24x7 ? '24x7 Emergency' : 'Day OPD Only'}
                    </strong>
                  </div>
                </div>

                {/* DOCTORS ON DUTY */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem' }}>
                    Healthcare Staff on Duty:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedFacility.doctorsOnDuty?.map((doc, didx) => (
                      <li key={didx} style={{ marginBottom: '0.25rem' }}>
                        • <strong>{doc.name}</strong> ({doc.role})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CONTACT & HOURS */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <div>📞 Contact: <strong>{selectedFacility.contact}</strong></div>
                  <div>🕒 Hours: {selectedFacility.operatingHours}</div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-subtle)' }}>
                Click on any facility pin on the map to inspect live resources.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a 
                href={`tel:${selectedFacility?.contact || '108'}`} 
                className="btn btn-teal btn-sm"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <Phone size={14} />
                <span>Call Center</span>
              </a>
              <button 
                onClick={() => alert(`Directions calculated to ${selectedFacility?.name} (${selectedFacility?.distanceKm} km). Estimated transit: 18 mins.`)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Navigation size={14} />
                <span>Directions</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.4fr 0.6fr"] {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
