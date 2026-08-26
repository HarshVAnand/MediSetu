import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, Database } from 'lucide-react';

export const SyncBanner = ({ isOnline, onToggleOnline, pendingCount, onSyncNow, isSyncing }) => {
  return (
    <div style={{
      backgroundColor: isOnline ? (pendingCount > 0 ? '#fffbeb' : '#f0fdf4') : '#fef2f2',
      borderBottom: `1px solid ${isOnline ? (pendingCount > 0 ? '#fde68a' : '#bbf7d0') : '#fecaca'}`,
      padding: '0.45rem 1rem',
      fontSize: '0.8125rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isOnline ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#16a34a', fontWeight: 600 }}>
            <Wifi size={14} /> Connected to ABDM Central Mesh
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', fontWeight: 700 }}>
            <WifiOff size={14} /> Offline Mode Active (IndexedDB Persistent Local Storage)
          </span>
        )}

        <span style={{ color: 'var(--border-medium)' }}>|</span>

        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <Database size={13} />
          {pendingCount > 0 ? (
            <span style={{ color: '#d97706', fontWeight: 600 }}>
              {pendingCount} offline change{pendingCount > 1 ? 's' : ''} queued for sync
            </span>
          ) : (
            <span>All records synced locally in IndexedDB</span>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {pendingCount > 0 && isOnline && (
          <button 
            onClick={onSyncNow}
            disabled={isSyncing}
            className="btn btn-sm btn-teal"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
          >
            <RefreshCw size={12} className={isSyncing ? 'spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          userSelect: 'none'
        }}>
          <span>Simulate Network:</span>
          <input 
            type="checkbox" 
            checked={isOnline} 
            onChange={(e) => onToggleOnline(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 600, color: isOnline ? '#16a34a' : '#dc2626' }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </label>
      </div>
    </div>
  );
};
