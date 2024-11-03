import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import Logo from "../../public/azulito.svg"

import {AppBar, Button, IconButton, Toolbar, Box, 
    Drawer,
    //List,
    //ListItem,
    //ListItemIcon,
    //ListItemText,
    Divider, Typography, Tooltip} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutButton from "./Login/LogoutButton.tsx";
import LoginButton from "./Login/LoginButton.tsx";
import {useUserContext} from "../components/Login/UserProvider.tsx";
import { getFontFamily } from '../utils/fonts';

interface INavigation {
    isAuthenticated: boolean
}

const Navigation: React.FC<INavigation> = (props) => {
    const {isAuthenticated} = props;
    const { userData } = useUserContext();

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
    const drawerContent = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <AccountCircle sx={{ mr: 1 }} />
                <Typography variant="h6">{userData?.name}</Typography>
            </Box>
            <Divider />
            {isAuthenticated && <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}><LogoutButton/></Box>}

            {/*<List>
            <ListItem>
                    <Typography variant="h6">user@mail.com</Typography>
                </ListItem>
                <ListItem>
                    <Typography variant="h6">user@mail.com</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemIcon>
                    </ListItemIcon>
                </ListItem>
            </List>*/}
        </Box>
    );



    return (
    <AppBar position="fixed" color="default">
        <Toolbar>
            <Box
                component={Link}
                to={isAuthenticated ? "/tizadas" : "/"}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    mr: 3,
                    // Add hover effect
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
                        filter: 'brightness(0)', // This will make the logo black
                    }}
                />

            </Box>
            
            <Button 
                color="inherit"
                sx={{
                    fontFamily: getFontFamily('kanit')}} // Add this line  bodoni
                component={Link} to="/tutorial">Digitalizar moldes
            </Button>
            <Box sx={{ flexGrow: 1 }} /> {/* This empty box pushes everything after it to the right */}


            {isAuthenticated && (
                <div>
                    <Button color="inherit" component={Link} to="/tizadas">Mis Tizadas</Button>
                    <Button color="inherit" component={Link} to="/moldes">Mis Moldes</Button>
                    <Button color="inherit" component={Link} to="/inventario">Inventario</Button>
                </div>
            )}

            {!isAuthenticated && <LoginButton/>}

            {isAuthenticated && (
                <Tooltip title="Cuenta">
                <IconButton color="inherit" onClick={toggleDrawer(true)}>
                    <AccountCircle/>

                </IconButton>   
                </Tooltip>             
                )}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
        </Toolbar>
    </AppBar>
    );
};

export default Navigation;
