import React, { useState } from 'react';

import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';
import { FontFamilies, getFontFamily } from '../utils/fonts';

const Login = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);    
    const [nombre, setNombre] = useState('');    
    const [email, setEmail] = useState('');    

    const solicitarDemo = async () => {
        setIsModalOpen(true);       
    };

    const handleNombreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNombre(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
        
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    return (
        <PageLayout>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'left',
                justifyContent: 'center',
                minHeight: '80vh',
                gap: 4
            }}>
            <Typography 
                    variant="h1"
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        color: 'text.secondary',
                        //fontWeight: 'normal',
                        textAlign: 'left',
                        //fontFamily: getFontFamily('kalnia'), // Add this line
                         fontFamily: getFontFamily('mono'),
                        mb: 0
                    }}
                >
                    Bienvenido a
                </Typography>
                <Typography 
                    variant="h1" 
                    sx={{
                        fontSize: { xs: '3rem', sm: '4rem', md: '6rem' },
                        //fontWeight: 'bold',
                        fontFamily: getFontFamily('kalnia'), // Add this line  bodoni
                        background: 'linear-gradient(45deg, #708d81 30%, #708d81 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextStroke: '2px #001427',
                        textStroke: '2px #001427',
                        letterSpacing: '0.01em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        lineHeight: 0.7,
                        mb: 0,
                    }}
                >
                    SmartFactory
                </Typography>
                <Typography 
                    variant="h5"
                    sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        color: 'text.secondary',
                        textAlign: 'center',
                        mb: 1,
                        fontFamily: getFontFamily('mono'), // Add this line
                    }}
                >
                    Solicite una demo para digitalizar su emprendimiento y comenzar a optimizar sus procesos textiles. 
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={solicitarDemo}
                    sx={{
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        padding: '12px 48px',
                        borderRadius: '28px',
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #8d0801 30%, #bf0603 90%)',
                        boxShadow: '0 3px 5px 2px rgba(141, 8, 1, 0.3)',  // Updated shadow to match your red
                        '&:hover': {
                            background: 'linear-gradient(45deg, #bf0603 30%, #8d0801 90%)',  // Lighter versions of same colors
                            boxShadow: '0 4px 6px 3px rgba(141, 8, 1, 0.4)',  // Slightly more intense shadow on hover
                        },
                        fontFamily: getFontFamily('kanit')
                    }}
                >
                    Solicitar una demo
                </Button>
            </Box>

            {/*POPUP INGRESAR DATOS USUARIO*/}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <DialogTitle
                sx={{fontFamily: getFontFamily('mono'),}}
            >
                Ingresá tus datos y te contactaremos para darte acceso a la aplicaión.
            </DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                id="nombre"
                label="Nombre"
                type="text"
                fullWidth
                variant="outlined"
                value={nombre}
                onChange={handleNombreChange}
                rows={4}
                sx={{
                    mb: 2,
                }}
            />
            <TextField
                id="email"
                label="e-mail"
                type="text"
                fullWidth
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                rows={4}
            />
            </DialogContent>
            <DialogActions>
            <Button 
                onClick={handleCloseModal}
            >
                Cancelar
            </Button>
            <Button onClick={handleCloseModal} variant="contained">Enviar</Button>
            </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default Login;