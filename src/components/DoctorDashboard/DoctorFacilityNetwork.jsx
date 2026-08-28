import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { INITIAL_FACILITIES, calculateDistance } from '../../services/facilityData.js';
import { MapPin, Phone, Bed, Activity, ShieldCheck, Stethoscope, Building2 } from 'lucide-react';

export const DoctorFacilityNetwork = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedFacility, setSelectedFacility] = useState(INITIAL_FACILITIES[0]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.1332, 78.1388],
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

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    INITIAL_FACILITIES.forEach(fac => {
      const isGovt = fac.category === 'Government';
      const color = isGovt ? '#0d9488' : '#0f4c81';

      const icon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
            <div style="transform: rotate(45deg); color: #fff; font-size: 13px;">${isGovt ? '🏛️' : '🏥'}</div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([fac.lat, fac.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="padding: 6px; font-family: inherit; font-size: 12px;">
          <strong>${fac.name}</strong>
          <div style="font-size: 11px; color: #0d9488;">${fac.category} • ${fac.facilityType}</div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 700; margin-top: 2px;">Vacant Beds: ${fac.availableBeds}/${fac.totalBeds}</div>
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
          <span className="badge badge-teal">60km Hospital Network</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Live Bed & Specialist Directory</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={20} color="var(--medical-teal)" />
          <span>District Hospital Referral & Available Bed Capacity</span>
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.25rem' }} className="doc-net-grid">
        <div 
          ref={mapContainerRef}
          style={{ height: '420px', width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}
        />

        <div style={{ background: 'var(--bg-page)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {selectedFacility ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  {selectedFacility.category === 'Government' ? '🏛️ Government' : '🏥 Private'} • {selectedFacility.facilityType}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                  {selectedFacility.emergency24x7 ? '🚨 24x7 Ready' : 'OPD Only'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                {selectedFacility.name}
              </h4>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginBottom: '0.85rem', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}>
                <div>Total Beds: <strong>{selectedFacility.totalBeds}</strong></div>
                <div>Currently Free: <strong style={{ color: 'var(--success-green)' }}>{selectedFacility.availableBeds} beds</strong></div>
                <div>ICU Beds: <strong>{selectedFacility.icuBeds > 0 ? `${selectedFacility.availableIcuBeds} / ${selectedFacility.icuBeds} free` : 'No ICU'}</strong></div>
                <div>Oxygen Beds: <strong>{selectedFacility.oxygenBeds || 10} available</strong></div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
                  Doctors Available for Direct Case Handover:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedFacility.doctorsOnDuty?.map((doc, didx) => (
                    <div key={didx}>• <strong>{doc.name}</strong> — {doc.role}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <a href={`tel:${selectedFacility?.contact || '108'}`} className="btn btn-primary btn-sm" style={{ flex: 1, textDecoration: 'none' }}>
              <Phone size={14} /> Call Hospital ({selectedFacility?.contact})
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .doc-net-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
