import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { INITIAL_FACILITIES } from '../../services/facilityData.js';
import { MapPin, Phone, Bed, Stethoscope, Search, Navigation, Building2 } from 'lucide-react';

export const FacilityMap = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);

  const createIcon = (type) => {
    let color = '#0d9488';
    if (type === 'District Hospital') color = '#0f4c81';
    else if (type === 'CHC') color = '#0284c7';
    else if (type === 'Sub-Centre') color = '#16a34a';

    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
        ">
          <div style="transform: rotate(45deg); color: #fff; font-weight: 800; font-size: 12px;">+</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.1332, 78.1388],
        zoom: 11,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const filtered = INITIAL_FACILITIES.filter(fac => {
      const matchesTier = selectedTier === 'ALL' || fac.type.toLowerCase().includes(selectedTier.toLowerCase());
      const matchesQuery = !searchQuery || fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || fac.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTier && matchesQuery;
    });

    filtered.forEach(fac => {
      const icon = createIcon(fac.type);
      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 8px; font-family: inherit;">
          <strong style="color: #0f172a; font-size: 13px;">${fac.name}</strong>
          <div style="font-size: 11px; color: #0d9488; margin-top: 3px;">${fac.type} • ${fac.distanceKm} km</div>
          <div style="font-size: 11px; color: #64748b; margin: 4px 0;">${fac.address}</div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 600;">Available Beds: ${fac.availableBeds}/${fac.totalBeds}</div>
        </div>
      `);

      marker.on('click', () => setSelectedFacility(fac));
      markersRef.current.push(marker);
    });

  }, [selectedTier, searchQuery]);

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>OpenStreetMap Navigation</span>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} color="var(--medical-teal)" />
            <span>Find Rural Healthcare Facilities</span>
          </h3>
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-subtle)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-input"
            placeholder="Search PHC, CHC, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.8125rem' }}
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {['ALL', 'PHC', 'CHC', 'District Hospital', 'Sub-Centre'].map(tier => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            style={{
              background: selectedTier === tier ? 'var(--primary-navy)' : 'var(--bg-page)',
              color: selectedTier === tier ? '#ffffff' : 'var(--text-main)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tier === 'ALL' ? 'All Health Centers' : tier}
          </button>
        ))}
      </div>

      {/* MAP CONTAINER & FACILITY DETAILS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.3fr 0.7fr',
        gap: '1.25rem'
      }}>
        
        {/* LEAFLET MAP */}
        <div 
          ref={mapContainerRef}
          style={{
            height: '400px',
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
          {selectedFacility ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{selectedFacility.type}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                  {selectedFacility.distanceKm} km away
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                {selectedFacility.name}
              </h4>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                {selectedFacility.address}
              </p>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <div>Available Beds: <strong style={{ color: 'var(--success-green)' }}>{selectedFacility.availableBeds}</strong> / {selectedFacility.totalBeds}</div>
                <div>Emergency: <strong>{selectedFacility.emergency24x7 ? '24x7 Emergency Ready' : 'OPD Only'}</strong></div>
                <div>Phone: <strong>{selectedFacility.contact}</strong></div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                  Available Specialties:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {selectedFacility.specialties.map((s, sidx) => (
                    <span key={sidx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-subtle)' }}>Select a facility on the map.</div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <a href={`tel:${selectedFacility?.contact || '108'}`} className="btn btn-teal btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
              <Phone size={14} /> Call
            </a>
            <button onClick={() => alert(`Directions calculated to ${selectedFacility?.name}`)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <Navigation size={14} /> Directions
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.3fr 0.7fr"] {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
