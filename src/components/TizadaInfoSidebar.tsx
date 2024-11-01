import React, { useState } from 'react';
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
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

interface TizadaInfoSidebarProps {
  tizadaInfoRows: any[];
  tizadaInfoColumns: GridColDef[];
  moldRows: any[];
  moldColumns: GridColDef[];
}

const TizadaInfoSidebar: React.FC<TizadaInfoSidebarProps> = ({
  tizadaInfoRows,
  tizadaInfoColumns,
  moldRows,
  moldColumns,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Info Icon Button */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          right: '20px',
          top: '80px',
          backgroundColor: 'white',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
          zIndex: 1200,
        }}
      >
        <InfoIcon />
      </IconButton>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : '350px',
            boxSizing: 'border-box',
            p: 3,
            backgroundColor: '#fafafa',
          },
        }}
      >
        {/* Drawer Header */}
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

        {/* Tizada Info Grid */}
        <DataGrid
          rows={tizadaInfoRows}
          columns={tizadaInfoColumns}
          hideFooter={true}
          disableColumnMenu
          autoHeight
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{ mb: 4 }}
        />

        {/* Molds Section */}
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
};

export default TizadaInfoSidebar;