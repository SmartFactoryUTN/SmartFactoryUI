import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SVGViewer from './SVGViewer';

interface MoldePreviewModalProps {
  open: boolean;
  onClose: () => void;
  moldeUrl: string | null;
  moldeName: string | null;
  moldeDescription: string | null;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 30;
const ZOOM_STEP = 0.1;
const DEFAULT_ZOOM = 1;

const MoldePreviewModal: React.FC<MoldePreviewModalProps> = ({
  open,
  onClose,
  moldeUrl,
  moldeName,
  moldeDescription
}) => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setZoom(DEFAULT_ZOOM);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Update container dimensions when modal opens and on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };

    if (open) {
      // Initial measurement after a short delay to ensure modal is fully rendered
      const timeoutId = setTimeout(updateDimensions, 100);
      
      // Set up resize observer
      const resizeObserver = new ResizeObserver(updateDimensions);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    }
  }, [open]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleReset = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition({ x: 0, y: 0 });
  };

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

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomFactor = zoom >= 1 ? 0.2 : 0.1;
      const delta = -Math.sign(e.deltaY) * zoomFactor;
      setZoom(prev => Math.min(Math.max(prev + delta, MIN_ZOOM), MAX_ZOOM));
    }
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '800px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6">
            {moldeName}
          </Typography>
          {moldeDescription && (
            <Typography variant="body2" color="text.secondary">
              {moldeDescription}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={handleZoomOut} 
            disabled={zoom <= MIN_ZOOM}
            size="small"
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ minWidth: 60, textAlign: 'center', lineHeight: '32px' }}>
            {Math.round(zoom * 100)}%
          </Typography>
          <IconButton 
            onClick={handleZoomIn} 
            disabled={zoom >= MAX_ZOOM}
            size="small"
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            onClick={handleReset}
            disabled={zoom === DEFAULT_ZOOM && position.x === 0 && position.y === 0}
            size="small"
          >
            <RestartAltIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent 
        sx={{ 
          position: 'relative',
          padding: 0,
          overflow: 'hidden'
        }}
        onWheel={handleWheel}
      >
        {moldeUrl && (
          <Box
            ref={containerRef}
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              backgroundColor: '#f5f5f5',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            {containerDimensions.width > 0 && containerDimensions.height > 0 && (
              <SVGViewer
                url={moldeUrl}
                containerWidth={containerDimensions.width}
                containerHeight={containerDimensions.height}
                zoom={zoom}
                position={position}
                isDragging={isDragging}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoldePreviewModal;