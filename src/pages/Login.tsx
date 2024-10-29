import React, { useState } from 'react';

import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PageLayout from '../components/layout/PageLayout';
import { getFontFamily } from '../utils/fonts';

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
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 3px 5px 2px rgba(141, 8, 1, 0.3)',
                        fontFamily: getFontFamily('kanit'),
                        background: 'linear-gradient(45deg, #56002D 20%, #bf0603 95%)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, #bf0603 40%, #56002D 60%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover': {
                            boxShadow: '0 4px 6px 3px rgba(141, 8, 1, 0.4)',
                        },
                    }}
                >
                    Solicitar una demo
                </Button>
            </Box>

            {/*POPUP INGRESAR DATOS USUARIO*/}
            <Dialog open={isModalOpen} onClose={handleCloseModal} 
                sx={{padding:'20px'}}
            >
            <DialogTitle
                sx={{fontFamily: getFontFamily('mono'),padding:'30px'}}
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
            <DialogActions
                sx={{fontFamily: getFontFamily('mono'),padding:'20px'}}
            >
            <Button 
                onClick={handleCloseModal}
                sx={{color: '#56002D',
                    '&:hover': {boxShadow: 'inset 9px 9px 16px rgb(163,177,198,0.3), inset -9px -9px 16px rgba(255,255,255, 0.3)'                     
                    }                 
                    }}
            >
                Cancelar
            </Button>
            <Button 
                onClick={handleCloseModal} variant="contained"
                sx={{
                    background: 'linear-gradient(45deg, #7b0044 30%, #A52066 90%)',
                    boxShadow: '9px 9px 16px rgb(255, 204, 159, 0.69) -9px -9px 16px rgba(0,0,0, 0.2)',
                    border: 'none',
                    '&:hover': { boxShadow: 'inset 9px 9px 16px rgb(163,177,198,0.1), inset -9px -9px 16px rgba(255,255,255, 0.1)' }
                }}
            >    
                Enviar
            </Button>
            </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default Login;