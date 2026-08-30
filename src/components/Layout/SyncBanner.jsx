import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SyncBanner = ({ 
  isOnline, 
  pendingSyncCount, 
  isSyncing, 
  onSyncNow, 
  onToggleNetwork 
}) => {
  return (
    <div style={{
      backgroundColor: isOnline ? 'var(--bg-subtle)' : '#fffbeb',
      borderBottom: `1px solid ${isOnline ? 'var(--border-light)' : '#fde68a'}`,
      padding: '0.45rem 0',
      fontSize: '0.8125rem',
      transition: 'background-color var(--transition-normal)'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {/* Network Status Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOnline ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success-green)', fontWeight: 600 }}>
              <Wifi size={14} />
              <span>Connected Online</span>
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning-amber)', fontWeight: 700 }}>
              <WifiOff size={14} />
              <span>Offline Mode Active — Records are safely saving to your device</span>
            </span>
          )}

          {pendingSyncCount > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>
              {pendingSyncCount} {pendingSyncCount === 1 ? 'record' : 'records'} waiting to sync
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {pendingSyncCount > 0 && isOnline && (
            <button 
              onClick={onSyncNow}
              disabled={isSyncing}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} className={isSyncing ? 'spin-anim' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          )}

          <button 
            onClick={onToggleNetwork}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subtle)',
              fontSize: '0.75rem',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            title="Toggle network simulation"
          >
            {isOnline ? 'Test Offline Mode' : 'Switch to Online'}
          </button>
        </div>
      </div>

      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
