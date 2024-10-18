import React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navigation: React.FC = () => {
  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        {/* Application title or logo */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left', fontWeight: 'bold' }}>
          SmartFactory
        </Typography>
        
        {/* Navigation Buttons */}
        <Button color="inherit" component={Link} to="/tizadas">Tizada</Button>
        <Button color="inherit" component={Link} to="/moldes">Escaneo de Moldes</Button>
        <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
        
        {/* Profile icon with dropdown (simplified as IconButton for now) */}
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
