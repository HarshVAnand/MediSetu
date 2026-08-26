import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { INITIAL_FACILITIES } from '../../services/facilityData.js';
import { MapPin, Phone, Bed, Activity, ShieldCheck, Stethoscope } from 'lucide-react';

export const DoctorFacilityNetwork = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[3]); // District Hospital by default

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

    INITIAL_FACILITIES.forEach(fac => {
      let color = '#0d9488';
      if (fac.type === 'District Hospital') color = '#0f4c81';
      else if (fac.type === 'CHC') color = '#0284c7';
      else if (fac.type === 'Tertiary Medical College') color = '#7c3aed';

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
            <div style="transform: rotate(45deg); color: #fff; font-weight: 800; font-size: 13px;">+</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="padding: 8px; font-family: inherit;">
          <strong>${fac.name}</strong>
          <div style="font-size: 11px; color: #0d9488;">${fac.type}</div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 700; margin-top: 3px;">Vacant Beds: ${fac.availableBeds}/${fac.totalBeds}</div>
        </div>
      `);

      marker.on('click', () => setSelectedFacility(fac));
      markersRef.current.push(marker);
    });

  }, []);

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="badge badge-teal">District Coordination Map</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Live Tele-Referral Directory</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={20} color="var(--medical-teal)" />
          <span>District Health Referral Capacity & Resource Network</span>
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.25rem' }}>
        <div 
          ref={mapContainerRef}
          style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}
        />

        <div style={{ background: 'var(--bg-page)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {selectedFacility ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>{selectedFacility.type}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{selectedFacility.distanceKm} km</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                {selectedFacility.name}
              </h4>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <div>Total Inpatient Beds: <strong>{selectedFacility.totalBeds}</strong></div>
                <div>Currently Vacant: <strong style={{ color: 'var(--success-green)' }}>{selectedFacility.availableBeds} beds</strong></div>
                <div>ICU / Critical Care: <strong>{selectedFacility.icuAvailable ? 'Available (Level-2)' : 'No ICU'}</strong></div>
                <div>Emergency Trauma: <strong>{selectedFacility.emergency24x7 ? '24x7 On Standby' : 'OPD Only'}</strong></div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
                  Specialists Available for Tele-Handover:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedFacility.doctorsOnDuty?.map((doc, didx) => (
                    <div key={didx}>• <strong>{doc.name}</strong> ({doc.role})</div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <a href={`tel:${selectedFacility?.contact || '108'}`} className="btn btn-primary btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
              <Phone size={14} /> Tele-Handover ({selectedFacility?.contact})
            </a>
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
