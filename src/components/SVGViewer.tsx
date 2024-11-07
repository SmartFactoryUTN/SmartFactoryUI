import React, { useState, useEffect } from 'react';

interface SVGViewerProps {
  url: string;
  containerWidth: number;
  containerHeight: number;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
}

const SVGViewer: React.FC<SVGViewerProps> = ({ 
  url, 
  containerWidth,
  containerHeight,
  zoom,
  position,
  isDragging 
}) => {
  const [modifiedSvgUrl, setModifiedSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const fetchAndModifySvg = async () => {
      try {
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
            // Store the actual dimensions
            setSvgDimensions({ width: binWidth, height: binHeight });
            
            // Update the SVG attributes
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
        console.error('Error modifying SVG:', err);
        setError('Error loading SVG');
      }
    };

    fetchAndModifySvg();
    
    return () => {
      if (modifiedSvgUrl) {
        URL.revokeObjectURL(modifiedSvgUrl);
      }
    };
  }, [url]);

  if (error) return <div>Error: {error}</div>;
  if (!svgDimensions) return <div>Loading...</div>;

  // Calculate the scale to fit the container while maintaining aspect ratio
  const scale = Math.min(
    containerWidth / svgDimensions.width,
    containerHeight / svgDimensions.height
  ) * 0.9; // 90% to leave some margin

  return (
    <object
      type="image/svg+xml"
      data={modifiedSvgUrl || url}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) 
                   translate(${position.x}px, ${position.y}px) 
                   scale(${scale * zoom})`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        transformOrigin: 'center',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      Su navegador no soporta SVGs
    </object>
  );
};

export default SVGViewer;