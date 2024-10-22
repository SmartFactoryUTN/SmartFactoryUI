import React from 'react';
import {Link} from 'react-router-dom';

import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutButton from "./Login/LogoutButton.tsx";
import LoginButton from "./Login/LoginButton.tsx";

interface INavigation {
    isAuthenticated: boolean
}
const Navigation: React.FC<INavigation> = (props) => {

    const {isAuthenticated} = props;

  return (
    <AppBar position="fixed" color="default">
        <Toolbar>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'left', fontWeight: 'bold'}}>
                SmartFactory
            </Typography>

            {isAuthenticated && (
                <div>
                    <Button color="inherit" component={Link} to="/tizadas">Tizada</Button>
                    <Button color="inherit" component={Link} to="/moldes">Escaneo de Moldes</Button>
                    <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
                </div>
            )}
            {!isAuthenticated && <LoginButton/>}
            {isAuthenticated && <LogoutButton/>}

            {isAuthenticated && (<IconButton color="inherit">
                <AccountCircle/>
            </IconButton>)}
        </Toolbar>
    </AppBar>
  );
};

export default Navigation;
