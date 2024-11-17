import React, { useState, useEffect, useRef } from 'react';
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
  isTizada?: boolean;
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
  isTizada = false
}) => {
  const originalUrlRef = useRef<string>('');
  const [modifiedSvgUrl, setModifiedSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const processSvg = async () => {
      if (url === originalUrlRef.current) return;
      originalUrlRef.current = url;

      try {
        setIsLoaded(false);
        const response = await fetch(url);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        
        if (isTizada) {
          const binElement = svgDoc.querySelector('.bin');
          if (binElement) {
            const width = parseFloat(binElement.getAttribute('width') || '0');
            const height = parseFloat(binElement.getAttribute('height') || '0');
            const largerDimension = Math.max(width, height);
            const normalizedWidth = (width / largerDimension) * containerWidth;
            const normalizedHeight = (height / largerDimension) * containerHeight;
            setSvgDimensions({ width: normalizedWidth, height: normalizedHeight });
            
            const modifiedUrl = await fixTizadaSVGViewbox(url);
            setModifiedSvgUrl(modifiedUrl);
          }
        } else {
          setModifiedSvgUrl(url);
          const svgElement = svgDoc.querySelector('svg');
          if (svgElement) {
            const width = parseFloat(svgElement.getAttribute('width') || '100');
            const height = parseFloat(svgElement.getAttribute('height') || '100');
            setSvgDimensions({ width, height });
          }
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
      if (modifiedSvgUrl && isTizada && originalUrlRef.current !== url) {
        URL.revokeObjectURL(modifiedSvgUrl);
      }
    };
  }, [url, isTizada, containerWidth, containerHeight]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (error) return <div>Error: {error}</div>;
  if (!svgDimensions || !modifiedSvgUrl) return (
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

  let scale;
  if (isTizada) {
    scale = 1; // Use normalized dimensions instead of calculating scale
  } else {
    scale = Math.min(
      containerWidth / svgDimensions.width,
      containerHeight / svgDimensions.height
    ) * 0.9;
  }

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