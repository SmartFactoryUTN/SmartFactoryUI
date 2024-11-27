import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const StorylaneDemoSection: React.FC = () => {
  useEffect(() => {
    // Add Storylane script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.storylane.io/js/v2/storylane.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Box
        sx={{
          position: 'relative',
          paddingBottom: 'calc(62.50% + 25px)',
          width: '100%',
          height: 0,
          transform: 'scale(1)'
        }}
        className="sl-embed"
      >
        <Box
          component="iframe"
          loading="lazy"
          className="sl-demo"
          src="https://app.storylane.io/demo/7e4veyhv8q2v?embed=inline"
          name="sl-embed"
          allow="fullscreen"
          allowFullScreen
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100% !important',
            height: '100% !important',
            border: '1px solid rgba(63,95,172,0.35)',
            borderRadius: '10px',
            boxShadow: '0px 0px 18px rgba(26, 19, 72, 0.15)',
            boxSizing: 'border-box'
          }}
        />
      </Box>
    </Box>
  );
};

export default StorylaneDemoSection;