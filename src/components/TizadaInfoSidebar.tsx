import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Drawer,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

interface TizadaInfoSidebarProps {
  tizadaInfoRows: any[];
  tizadaInfoColumns: GridColDef[];
  moldRows: any[];
  moldColumns: GridColDef[];
  onDownload?: () => void;
  canDownload?: boolean;
}



const MIN_DRAWER_WIDTH = 300;
const MAX_DRAWER_WIDTH = 600;
const DEFAULT_DRAWER_WIDTH = 350;
const CONTROL_BAR_WIDTH = 60;
const NAVBAR_HEIGHT = 64; // Adjust this value to match your navbar height

export default function TizadaInfoSidebar({
  tizadaInfoRows,
  tizadaInfoColumns,
  moldRows,
  moldColumns,
  onDownload,
  canDownload = false,
}: TizadaInfoSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => setIsOpen(!isOpen);

  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.pageX;
    const startWidth = drawerWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (startX - e.pageX);
      if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= MAX_DRAWER_WIDTH) {
        setDrawerWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [drawerWidth]);

  return (
    <>
      {/* Fixed Control Bar */}
      <Box
        sx={{
          position: 'fixed',
          right: isOpen ? drawerWidth : 0,
          top: NAVBAR_HEIGHT,
          bottom: 0,
          width: CONTROL_BAR_WIDTH,
          backgroundColor: 'white',
          borderLeft: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
          gap: 2,
          zIndex: theme.zIndex.drawer - 1, // Ensure it's below the navbar
          transition: isResizing ? 'none' : 'right 0.2s',
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          sx={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          {isOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowLeftIcon />}
        </IconButton>

        <IconButton
          onClick={onDownload}
          disabled={!canDownload}
          sx={{
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0,0,0,0.12)',
            },
          }}
        >
          <DownloadIcon />
        </IconButton>
      </Box>

      {/* Resizable Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : drawerWidth,
            boxSizing: 'border-box',
            p: 3,
            backgroundColor: '#fafafa',
            transition: isResizing ? 'none' : 'width 0.2s',
            marginTop: `${NAVBAR_HEIGHT}px`, // Add margin to start below navbar
            height: `calc(100% - ${NAVBAR_HEIGHT}px)`, // Adjust height to account for navbar
          },
        }}
      >
        {/* Resize Handle */}
        {!isSmallScreen && (
          <Box
            onMouseDown={startResize}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: 'transparent',
              cursor: 'ew-resize',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
              '&:active': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          />
        )}

        {/* Drawer Content */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Información de Tizada
          </Typography>
          <IconButton onClick={toggleDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <DataGrid
          rows={tizadaInfoRows}
          columns={tizadaInfoColumns}
          hideFooter={true}
          disableColumnMenu
          autoHeight
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{ mb: 4 }}
        />

        <Typography variant="h6" gutterBottom>
          Moldes
        </Typography>
        <DataGrid
          rows={moldRows}
          columns={moldColumns}
          hideFooter={true}
          disableColumnMenu
          autoHeight
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </Drawer>
    </>
  );
}