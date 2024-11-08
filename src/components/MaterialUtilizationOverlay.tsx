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
        position: 'sticky',
        top: 20,
        left: 20,
        display: 'flex',
        flexDirection: 'column', // Make it stack vertically
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(245, 245, 245, 0.5)', 
        padding: '10px 10px',
        borderRadius: '8px',
        boxShadow: '0px 3px 8px rgba(63, 63, 103, 0.2)',
        zIndex: 2000, // Ensure it's above everything
        backdropFilter: 'blur(4px)', // Adds a frosted glass effect
        border: '1px solid rgba(250, 250, 250, 0.5)', // Subtle border
        width: 'fit-content'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PercentIcon sx={{ 
          fontSize: '1rem', 
          color: 'rgba(0, 0, 0, 0.7)',
        }} />
        <Typography sx={{ 
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'rgba(0, 0, 0, 0.7)',
          userSelect: 'none',
        }}>
          Aprovechamiento del material
        </Typography>
      </Box>
        <Typography sx={{ 
          fontSize: '1rem',
          fontWeight: 600,
          color: 'rgba(0, 0, 0, 0.75)',
          userSelect: 'none',
        }}>
          {utilization.toFixed(2)}%
        </Typography>
    </Box>
  );
};

export default MaterialUtilizationOverlay;