import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { fixTizadaSVGViewbox } from '../utils/helpers';

interface SVGViewerProps {
  url: string;
  containerWidth: number;
  containerHeight: number;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  isTizada?: boolean; // New prop to determine if this is a tizada view
}

const SVGViewer: React.FC<SVGViewerProps> = ({
  url,
  containerWidth,
  containerHeight,
  zoom,
  position,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  isTizada = false // Default to false for backward compatibility
}) => {
  const [modifiedSvgUrl, setModifiedSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const processSvg = async () => {
      try {
        setIsLoaded(false);
        
        if (isTizada) {
          // Use special handling for tizadas
          const modifiedUrl = await fixTizadaSVGViewbox(url);
          setModifiedSvgUrl(modifiedUrl);
          // We'll get dimensions from the object onLoad
          setSvgDimensions({ width: 100, height: 100 }); // Temporary dimensions
        } else {
          // Regular SVG handling (use directly)
          setModifiedSvgUrl(url);
          setSvgDimensions({ width: 100, height: 100 }); // Will be adjusted by scale
        }
      } catch (err) {
        console.error('Error processing SVG:', err);
        setError('Error al cargar el SVG');
      }
    };

    if (url) {
      processSvg();
    }
    
    return () => {
      if (modifiedSvgUrl && isTizada) {
        URL.revokeObjectURL(modifiedSvgUrl);
      }
    };
  }, [url, isTizada]);

  // Rest of the component remains the same
  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (error) return <div>Error: {error}</div>;
  if (!svgDimensions || !modifiedSvgUrl) return(
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      '& .dot': {
        width: '4px',
        height: '4px',
        backgroundColor: 'grey',
        borderRadius: '50%',
        animation: 'dotPulse 1.5s infinite',
        '&:nth-of-type(2)': {
          animationDelay: '0.2s',
        },
        '&:nth-of-type(3)': {
          animationDelay: '0.4s',
        },
      },
      '@keyframes dotPulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.5)' },
        '100%': { transform: 'scale(1)' },
      },
    }}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </Box>
  );

  const scale = Math.min(
    containerWidth / svgDimensions.width,
    containerHeight / svgDimensions.height
  ) * 0.9;

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <object
        type="image/svg+xml"
        data={modifiedSvgUrl}
        onLoad={handleLoad}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale * zoom})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          transformOrigin: 'center',
          maxWidth: '100%',
          maxHeight: '100%',
          pointerEvents: 'none',
        }}
      >
        Su navegador no soporta SVGs
      </object>
    </div>
  );
};

export default SVGViewer;