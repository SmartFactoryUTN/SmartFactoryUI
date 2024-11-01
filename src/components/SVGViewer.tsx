import React, { useState, useEffect, useRef } from 'react';

interface SVGViewerProps {
  url: string;
}

const SVGViewer: React.FC<SVGViewerProps> = ({ url }) => {
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<HTMLObjectElement | null>(null);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !svgRef.current) {
        console.log('Refs not ready yet');
        return;
      }

      const svgElement = (svgRef.current as HTMLObjectElement)
        .contentDocument?.querySelector('svg') as SVGSVGElement;
      
      if (!svgElement) {
        console.log('SVG element not loaded yet');
        return;
      }

      const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number);
      if (!viewBox) {
        setError('SVG missing viewBox attribute');
        return;
      }

      const [, , svgWidth, svgHeight] = viewBox;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      console.log('Container dimensions:', { width: containerWidth, height: containerHeight });
      console.log('SVG dimensions:', { width: svgWidth, height: svgHeight });

      const scaleX = containerWidth / svgWidth;
      const scaleY = containerHeight / svgHeight;
      const newScale = Math.min(scaleX, scaleY) * 0.9;
      
      console.log('Calculated scale:', newScale);
      setScale(newScale);
    };

    const resizeObserver = new ResizeObserver(() => {
      console.log('Container resized');
      calculateScale();
    });

    const currentContainer = containerRef.current;
    const currentSvgRef = svgRef.current;

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    if (currentSvgRef) {
      currentSvgRef.addEventListener('load', () => {
        console.log('SVG loaded');
        calculateScale();
      });
    }

    return () => {
      resizeObserver.disconnect();
      if (currentSvgRef) {
        currentSvgRef.removeEventListener('load', calculateScale);
      }
    };
  }, [url]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-gray-50"
      style={{ minHeight: '500px' }}
    >
      <object
        ref={svgRef}
        type="image/svg+xml"
        data={url}
        className="absolute left-1/2 top-1/2 origin-center bg-white"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: 'transform 0.3s ease-in-out',
          maxWidth: '100%',
          maxHeight: '100%',
          border: '1px solid #eee',
        }}
      >
        Su navegador no soporta SVGs
      </object>
    </div>
  );
};

export default SVGViewer;