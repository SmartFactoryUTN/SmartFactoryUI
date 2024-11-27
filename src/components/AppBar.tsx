import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Logo from "../../public/azulito.svg"
import UserDrawer from './UserDrawer';
import {
    AppBar, 
    Button, 
    IconButton, 
    Toolbar, 
    Box, 
    Drawer,
    Typography, 
    Tooltip
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginButton from "./Login/LoginButton.tsx";
import {useUserContext} from "../components/Login/UserProvider.tsx";
import {useAuth0} from "@auth0/auth0-react";

interface INavigation {
    isAuthenticated: boolean
}

const Navigation: React.FC<INavigation> = (props) => {
    const {isAuthenticated} = props;
    const { userData } = useUserContext();
    const { logout } = useAuth0();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <AppBar position="fixed" color="default">
            <Toolbar>
                <Box
                    component={Link}
                    to={isAuthenticated ? "/home" : "/"}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        mr: 3,
                        '&:hover': {
                            opacity: 0.8
                        },
                        transition: 'opacity 0.2s'
                    }}
                >
                    <img 
                        src={Logo} 
                        alt="SmartFactory Logo"
                        style={{
                            height: '40px',
                            width: 'auto',
                            filter: 'brightness(0)',
                        }}
                    />
                    <Typography color="black">
                        SMART FACTORY                
                    </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1 }} />

                {isAuthenticated && (
                    <div>
                        <Button color="inherit" component={Link} to="/tizadas">Mis Tizadas</Button>
                        <Button color="inherit" component={Link} to="/moldes">Mis Moldes</Button>
                        <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
                    </div>
                )}

                <Box sx={{ flexGrow: 1 }} />
                {!isAuthenticated && <LoginButton/>}

                {isAuthenticated && (
                    <Box>
                        <Button 
                            color="inherit"
                            component={Link} 
                            to="/tutorial-digitalizacion"
                        >
                            ¿Cómo digitalizar moldes?
                        </Button>
                        <Tooltip title="Cuenta">
                            <IconButton 
                                color="inherit" 
                                onClick={toggleDrawer(true)}
                                aria-label="cuenta de usuario"
                            >
                                <AccountCircle/>
                            </IconButton>   
                        </Tooltip>     
                    </Box>        
                )}
                
                <Drawer 
                    anchor="right" 
                    open={drawerOpen} 
                    onClose={toggleDrawer(false)}
                    PaperProps={{
                        sx: {
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }
                    }}
                >
                    <UserDrawer 
                        userData={userData}
                        isAuthenticated={isAuthenticated}
                        onClose={toggleDrawer(false)}
                        logout={logout}
                    />
                </Drawer>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;