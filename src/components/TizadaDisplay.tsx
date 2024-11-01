import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { Tizada } from '../utils/types';
import { useState, useCallback, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface TizadaDisplayProps {
  tizada: Tizada | null;
  svgUrl: string | null;
  onStartProgress: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

const TizadaDisplay = ({ tizada, svgUrl, onStartProgress }: TizadaDisplayProps) => {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Replace the current handler definitions with these:
const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.min(prev + ZOOM_STEP, MAX_ZOOM);
      console.log('Zooming in to:', newZoom); // For debugging
      return newZoom;
    });
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev - ZOOM_STEP, MIN_ZOOM);
      console.log('Zooming out to:', newZoom); // For debugging
      return newZoom;
    });
  }, []);
  
  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
      setZoom(prev => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const ZoomControls = useCallback(() => (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 1,
        borderRadius: 1,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <IconButton 
        onClick={handleZoomOut} 
        disabled={zoom <= MIN_ZOOM}
        sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
      >
        <RemoveIcon />
      </IconButton>
      <Typography sx={{ minWidth: 60, textAlign: 'center', lineHeight: '40px' }}>
        {Math.round(zoom * 100)}%
      </Typography>
      <IconButton 
        onClick={handleZoomIn} 
        disabled={zoom >= MAX_ZOOM}
        sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
      >
        <AddIcon />
      </IconButton>
      <IconButton 
        onClick={handleReset} 
        disabled={zoom === 1 && position.x === 0 && position.y === 0}
        sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' } }}
      >
        <RestartAltIcon />
      </IconButton>
    </Box>
  ), [zoom, position, handleZoomIn, handleZoomOut, handleReset]);

  
  const getContent = () => {
    if (!tizada) return null;

    switch (tizada.state) {
      case 'CREATED':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ¿Todo listo para comenzar? Confirme que los datos sean correctos para empezar a generar su tizada.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={onStartProgress}
            >
              GENERAR TIZADA
            </Button>
          </Box>
        );

      case 'IN_PROGRESS':
        return <CircularProgress />;

      case 'FINISHED':
        if (svgUrl) {
          return (
            <Box
              ref={containerRef}
              onWheel={handleWheel}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
              >
                <iframe
                  src={svgUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    pointerEvents: 'none', // This prevents iframe from capturing events
                  }}
                  title="Tizada SVG"
                />
              </Box>
              <ZoomControls />
            </Box>
          );
        }
        return null;

      case 'ERROR':
        return (
          <Typography variant="h6" align="center">
            Error en la generación de la tizada
          </Typography>
        );

      default:
        return (
          <Typography variant="h6" align="center">
            Estado desconocido
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      p: 2,
      position: 'relative',
    }}>
      {getContent()}
    </Box>
  );
};

export default TizadaDisplay;