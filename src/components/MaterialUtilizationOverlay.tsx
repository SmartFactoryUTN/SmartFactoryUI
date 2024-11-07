// MaterialUtilizationOverlay.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';

interface MaterialUtilizationOverlayProps {
  utilization: number;
}

const MaterialUtilizationOverlay: React.FC<MaterialUtilizationOverlayProps> = ({ utilization }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        display: 'flex',
        flexDirection: 'column', // Make it stack vertically
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(33, 33, 33, 0.5)', // Darker, semi-transparent background
        padding: '10px 16px',
        borderRadius: '8px',
        boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 2000, // Ensure it's above everything
        backdropFilter: 'blur(4px)', // Adds a frosted glass effect
        border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PercentIcon sx={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255, 255, 255, 0.9)',
        }} />
        <Typography sx={{ 
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          userSelect: 'none',
        }}>
          Aprovechamiento del material
        </Typography>
      </Box>
        <Typography sx={{ 
          fontSize: '1rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.9)',
          userSelect: 'none',
        }}>
          {utilization.toFixed(2)}%
        </Typography>
    </Box>
  );
};

export default MaterialUtilizationOverlay;