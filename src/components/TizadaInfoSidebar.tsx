import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Drawer,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { formatTimeRemaining, formatTimeAgo } from '../utils/helpers';
import {TizadaResult} from '../utils/types'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';

import {GridColDef} from '@mui/x-data-grid'; //GridRowParams ? Maybe needed to fetch and download a tizada by ID


interface TizadaInfoSidebarProps {
  tizadaInfoRows: any[];
  tizadaInfoColumns: GridColDef[];
  moldRows: any[];
  moldColumns: GridColDef[];
  onDownload?: () => void;
  canDownload?: boolean;
  tizada: TizadaResult | null; 
  sidebarState: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    drawerWidth: number;
    setDrawerWidth: (width: number) => void;
  };
}

const MIN_DRAWER_WIDTH = 300;
const MAX_DRAWER_WIDTH = 600;
const CONTROL_BAR_WIDTH = 60;
const NAVBAR_HEIGHT = 64;

const getStatusConfig = (status: string) => {
  const config = {
    CREATED: { color: 'warning', label: 'Creada' },
    IN_PROGRESS: { color: 'info', label: 'En curso' },
    FINISHED: { color: 'success', label: 'Finalizada' },
    ERROR: { color: 'error', label: 'Error' }
  };
  return config[status as keyof typeof config] || config.CREATED;
};

export default function TizadaInfoSidebar({
  tizadaInfoRows,
  moldRows,
  onDownload,
  canDownload = false,
  tizada, 
  sidebarState,
}: TizadaInfoSidebarProps) {
  const { isOpen, setIsOpen, drawerWidth, setDrawerWidth } = sidebarState;
  const [isResizing, setIsResizing] = useState(false);
  //const [isOpen, setIsOpen] = useState(true);
  //const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  //const [isResizing, setIsResizing] = useState(false);
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

  // Extract info from tizadaInfoRows
  const tizadaName = tizadaInfoRows.find(row => row.property === 'Nombre')?.value || '';
  const tizadaStatus = tizadaInfoRows.find(row => row.property === 'Estado')?.value || 'CREATED';
  const dimensions = tizadaInfoRows.find(row => row.property === 'Dimensiones (Ancho x Alto)')?.value || '';
  const createdAt = tizadaInfoRows.find(row => row.property === 'Fecha de Creación')?.value || '';
  const updatedAt = tizadaInfoRows.find(row => row.property === 'Última Actualización')?.value || '';
  const totalMolds = tizadaInfoRows.find(row => row.property === 'Total de moldes')?.value || '0';

  const statusConfig = getStatusConfig(tizadaStatus);

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
          zIndex: theme.zIndex.drawer - 1,
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
          <KeyboardArrowLeftIcon />
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
            backgroundColor: '#fafafa',
            transition: isResizing ? 'none' : 'width 0.2s',
            marginTop: `${NAVBAR_HEIGHT}px`,
            height: `calc(100% - ${NAVBAR_HEIGHT}px)`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Prevent double scrollbars
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
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
            },
          }}
        >
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 3,
          }}>
            <Box  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                {tizadaName}
              </Typography>
              <Chip
                icon={<CircleIcon sx={{ fontSize: '12px !important' }} />}
                label={statusConfig.label}
                color={statusConfig.color as any}
                size="small"
                variant="outlined"
                sx={{ alignSelf: 'left' }}
              />
            </Box>
            <IconButton onClick={toggleDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Dimensiones de la mesa de corte
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {dimensions}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Fecha de creación
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {createdAt}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Última actualización
            </Typography>
            <Typography variant="body1">
              {updatedAt}
            </Typography>
          </Box>

          {tizada?.state === 'IN_PROGRESS' && (
          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`Optimizando ${formatTimeAgo(tizada.invokedAt)}`}
              color="default"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Chip
              icon={<TimerIcon />}
              label={formatTimeRemaining(tizada.estimatedEndTime)}
              color="default"
              variant="outlined"
            />
          </Box>
          )}
          <Divider sx={{ mb: 3 }} />

          {/* Molds Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Moldes
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total de moldes: {totalMolds}
            </Typography>

            <TableContainer 
              component={Paper} 
              elevation={0} 
              sx={{ 
                backgroundColor: 'transparent',
                mt: 2
              }}
            >
              <Table size="small" sx={{ 
                '& th': { 
                  fontWeight: 600,
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderBottom: '2px solid rgba(224, 224, 224, 1)'
                },
                '& td, & th': {
                  fontSize: '0.875rem',
                  py: 1.5,
                  px: 2,
                }
              }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Art.</TableCell>
                    <TableCell>Desc.</TableCell>
                    <TableCell align="right">Cant.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {moldRows.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}