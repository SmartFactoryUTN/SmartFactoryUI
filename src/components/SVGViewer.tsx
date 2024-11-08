import React, { useState, useEffect } from 'react';
import { Box, } from '@mui/material';

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
  onMouseLeave
}) => {
  const [modifiedSvgUrl, setModifiedSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Separate useEffect for SVG processing that only depends on url
  useEffect(() => {
    const fetchAndModifySvg = async () => {
      try {
        setIsLoaded(false);
        const response = await fetch(url);
        const svgText = await response.text();
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        const binElement = svgDoc.querySelector('.bin');
        
        if (svgElement && binElement) {
          const binWidth = parseFloat(binElement.getAttribute('width') || '0');
          const binHeight = parseFloat(binElement.getAttribute('height') || '0');
          
          if (binWidth && binHeight) {
            setSvgDimensions({ width: binWidth, height: binHeight });
            
            svgElement.setAttribute('width', binWidth.toString());
            svgElement.setAttribute('height', binHeight.toString());
            svgElement.setAttribute('viewBox', `0 0 ${binWidth} ${binHeight}`);
            
            const modifiedSvgText = new XMLSerializer().serializeToString(svgDoc);
            const blob = new Blob([modifiedSvgText], { type: 'image/svg+xml' });
            const modifiedUrl = URL.createObjectURL(blob);
            
            setModifiedSvgUrl(modifiedUrl);
          }
        }
      } catch (err) {
        console.error('Error loading SVG:', err);
        setError('Error al cargar el SVG');
      }
    };

    if (url) {
      fetchAndModifySvg();
    }
    
    return () => {
      if (modifiedSvgUrl) {
        URL.revokeObjectURL(modifiedSvgUrl);
      }
    };
  }, [url]); // Only depend on url changes

  // Calculate scale based on container dimensions
  

  const handleLoad = () => {
    console.log('SVG loaded');
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

  const scale = svgDimensions ? Math.min(
    containerWidth / svgDimensions.width,
    containerHeight / svgDimensions.height
  ) * 0.9 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        opacity: isLoaded ? 1 : 0, // Fade in when loaded
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