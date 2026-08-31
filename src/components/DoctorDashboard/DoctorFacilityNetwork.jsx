import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  PRESET_REGIONS, 
  getFacilitiesWithinRadius, 
  fetchNearbyHospitalsLive,
  calculateDistance 
} from '../../services/facilityData.js';
import { sendLocationToBackend } from '../../services/api.js';
import { MapPin, Phone, Bed, Activity, ShieldCheck, Stethoscope, Building2, Compass, AlertCircle } from 'lucide-react';

export const DoctorFacilityNetwork = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState({
    name: 'Kolar District & City',
    lat: 13.1367,
    lng: 78.1340,
    isLiveGps: false
  });

  const [radiusKm, setRadiusKm] = useState(60);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [liveDataset, setLiveDataset] = useState(null);

  const facilities = getFacilitiesWithinRadius(
    userLocation.lat,
    userLocation.lng,
    radiusKm,
    { category: categoryFilter },
    liveDataset
  );

  const currentFacility = selectedFacility || facilities[0] || null;

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
        const newLoc = {
          name: 'Your Live GPS Location',
          lat: latitude,
          lng: longitude,
          isLiveGps: true
        };
        setUserLocation(newLoc);
        setIsLocating(false);

        // Send location to backend via Axios
        try {
          await sendLocationToBackend(latitude, longitude, radiusKm, 'Doctor Live GPS');
        } catch (err) {
          console.debug('Backend location note:', err.message);
        }

        const live = await fetchNearbyHospitalsLive(latitude, longitude, radiusKm);
        if (live && live.length > 0) setLiveDataset(live);
        else setLiveDataset(null);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 11, { animate: true });
          setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeoError('Could not fetch exact GPS. Select a nearby city preset.');
        setIsLocating(false);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
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

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (circleRef.current) map.removeLayer(circleRef.current);
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

    // Draw user/doctor location pin
    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({
        className: 'doctor-user-pin',
        html: `<div style="width:18px;height:18px;background:#0f4c81;border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      })
    }).addTo(map);

    // Draw 60km circle
    circleRef.current = L.circle([userLocation.lat, userLocation.lng], {
      radius: radiusKm * 1000,
      color: '#0d9488',
      fillColor: '#14b8a6',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '5, 8'
    }).addTo(map);

    facilities.forEach(fac => {
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
          <div style="font-size: 11px; color: #0d9488;">${fac.category} • ${fac.distanceKm} km away</div>
          <div style="font-size: 11px; color: #16a34a; font-weight: 700; margin-top: 2px;">Available Beds: ${fac.availableBeds}/${fac.totalBeds}</div>
        </div>
      `);

      marker.on('click', () => setSelectedFacility(fac));
      markersRef.current.push(marker);
    });

    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 200);

  }, [userLocation, radiusKm, categoryFilter, liveDataset]);

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      {/* HEADER & CONTROLS */}
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-teal">60km Specialist & Bed Network</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Instant Emergency & Inpatient Directory</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={20} color="var(--medical-teal)" />
              <span>Nearby Hospital Referrals & Free Bed Availability</span>
            </h3>
          </div>

          {/* Live GPS & Region Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDetectLiveLocation}
              disabled={isLocating}
              className="btn btn-teal btn-sm"
              style={{ fontSize: '0.78125rem' }}
            >
              <MapPin size={14} className={isLocating ? 'spin-anim' : ''} />
              <span>{isLocating ? 'Detecting...' : '📍 Use Live GPS'}</span>
            </button>

            <select
              className="form-input"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78125rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-medium)',
                backgroundColor: '#ffffff'
              }}
              value={PRESET_REGIONS.find(r => r.name === userLocation.name)?.id || (userLocation.isLiveGps ? 'custom' : 'kolar-central')}
              onChange={(e) => {
                const found = PRESET_REGIONS.find(r => r.id === e.target.value);
                if (found) {
                  setUserLocation({ name: found.name, lat: found.lat, lng: found.lng, isLiveGps: false });
                  setGeoError(null);
                  try {
                    sendLocationToBackend(found.lat, found.lng, radiusKm, found.name);
                  } catch(e) {}
                }
              }}
            >
              {PRESET_REGIONS.map(r => (
                <option key={r.id} value={r.id}>📍 {r.name}</option>
              ))}
              {userLocation.isLiveGps && <option value="custom">📍 My Live GPS Location</option>}
            </select>
          </div>
        </div>

        {geoError && (
          <div style={{ fontSize: '0.75rem', color: 'var(--warning-amber)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={13} />
            <span>{geoError}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.25rem' }} className="doc-net-grid">
        <div 
          ref={mapContainerRef}
          style={{ height: '420px', width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}
        />

        <div style={{ background: 'var(--bg-page)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {currentFacility ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  {currentFacility.category === 'Government' ? '🏛️ Government' : '🏥 Private'} • {currentFacility.facilityType}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
                  {currentFacility.distanceKm} km away
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.35rem' }}>
                {currentFacility.name}
              </h4>

              <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                📍 {currentFacility.address}
              </p>

              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontSize: '0.8125rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>Available Beds: </span>
                  <strong style={{ color: 'var(--success-green)' }}>{currentFacility.availableBeds}</strong> / {currentFacility.totalBeds}
                </div>
                <div>
                  <span style={{ color: 'var(--text-subtle)' }}>ICU Free: </span>
                  <strong>{currentFacility.availableIcuBeds || 0}</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <strong>On Duty:</strong> {currentFacility.doctorsOnDuty?.map(d => d.name).join(', ')}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
              Click any hospital pin on the map to view available beds and on-duty specialists.
            </div>
          )}

          <a 
            href={`tel:${currentFacility?.contact}`}
            className="btn btn-teal btn-sm"
            style={{ width: '100%', marginTop: '1rem', textDecoration: 'none' }}
          >
            <Phone size={14} />
            <span>Call Hospital ({currentFacility?.contact})</span>
          </a>
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
