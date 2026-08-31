import React from 'react';

export const UserIllustration = ({ 
  gender = 'Male', 
  size = 72, 
  name = '', 
  className = '',
  style = {} 
}) => {
  const isFemale = gender?.toLowerCase() === 'female';
  
  // Custom SVG Vector Patient Illustration
  return (
    <div 
      className={`user-illustration ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '16px',
        background: isFemale 
          ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' 
          : 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(15, 76, 129, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.6)',
        flexShrink: 0,
        ...style
      }}
      title={name || 'Patient Avatar'}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Aura */}
        <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.08" />
        
        {/* Body / Shoulders */}
        <path 
          d={isFemale 
            ? "M20 92C20 74 34 68 50 68C66 68 80 74 80 92C80 95 78 98 74 98H26C22 98 20 95 20 92Z"
            : "M18 92C18 72 32 66 50 66C68 66 82 72 82 92C82 95 80 98 76 98H24C20 98 18 95 18 92Z"
          } 
          fill="#ffffff" 
          fillOpacity="0.95" 
        />
        
        {/* Collar / Attire Accent */}
        <path 
          d={isFemale
            ? "M42 68L50 82L58 68"
            : "M40 66L50 80L60 66"
          } 
          stroke={isFemale ? "#0d9488" : "#0f4c81"} 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Neck */}
        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fed7aa" />

        {/* Head / Face */}
        <ellipse cx="50" cy="42" rx="19" ry="21" fill="#fed7aa" />

        {/* Hair Style */}
        {isFemale ? (
          <>
            {/* Long & Tied Hair */}
            <path 
              d="M30 42C30 26 38 20 50 20C62 20 70 26 70 42C70 45 68 52 66 54C64 45 62 30 50 30C38 30 36 45 34 54C32 52 30 45 30 42Z" 
              fill="#1e293b" 
            />
            {/* Bun on Top */}
            <ellipse cx="50" cy="18" rx="9" ry="7" fill="#1e293b" />
          </>
        ) : (
          <>
            {/* Short Neat Hair */}
            <path 
              d="M31 38C31 24 40 19 50 19C60 19 69 24 69 38C69 34 67 27 50 27C33 27 31 34 31 38Z" 
              fill="#1e293b" 
            />
          </>
        )}

        {/* Eyes & Friendly Smile */}
        <circle cx="43" cy="42" r="2.2" fill="#1e293b" />
        <circle cx="57" cy="42" r="2.2" fill="#1e293b" />
        <path d="M45 49Q50 54 55 49" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />

        {/* Health Verification Heart / Shield Badge */}
        <g transform="translate(62, 62)">
          <circle cx="12" cy="12" r="11" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
          <path 
            d="M8.5 12L11 14.5L15.5 9.5" 
            stroke="#ffffff" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>
      </svg>
    </div>
  );
};
