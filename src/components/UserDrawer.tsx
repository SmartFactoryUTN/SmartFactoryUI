import { Box, Typography, Divider, Button, Stack } from '@mui/material';
import { SubSectionTitle } from './TitleTypographies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import BoltIcon from '@mui/icons-material/Bolt';
import LogoutIcon from '@mui/icons-material/Logout';

interface UserDrawerProps {
    userData: any;
    isAuthenticated: boolean;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;  // Updated this line
    availableCredits?: number;
    logout: any;
}

export default function UserDrawer({ userData, isAuthenticated, onClose, logout }: UserDrawerProps){
  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 'auto' },
        minWidth: { sm: '320px' },
        maxWidth: { sm: '400px' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      {/* Header Section */}
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccountCircleIcon sx={{ mr: 2, fontSize: '2.5rem' }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Iniciaste sesión como:
            </Typography>
            <SubSectionTitle>
              {userData?.email || 'Usuario'}
            </SubSectionTitle>
          </Box>
        </Box>
      </Box>
      
      <Divider />

      {/* Main Content */}
      <Box sx={{ p: 3, flex: 1 }}>
        <Stack spacing={2}>
          {/* Account Status Section */}
          <Box sx={{ 
            p: 2.5,
            bgcolor: 'background.default',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>

            {/* Credits Status */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
            }}>
              <BoltIcon 
                sx={{ 
                  mr: 2, 
                  color: 'secondary.main',
                  fontSize: '1.7rem'
                }} 
              />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Créditos disponibles
                </Typography>
                <Typography variant="h6">
                  {userData?.credits}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Footer Section */}
      <Box sx={{ mt: 'auto', p: 3, bgcolor: 'background.paper' }}>
        <Divider sx={{ mb: 3 }} />
        
        {/* Contact Info */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Información de Contacto
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 1 
          }}>
            <EmailIcon sx={{ mr: 1, fontSize: '0.9rem' }} color="action" />
            <Typography variant="body2" color="text.secondary">
              wearesmartfactory@gmail.com
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <PhoneIcon sx={{ mr: 1, fontSize: '0.9rem' }} color="action" />
            <Typography variant="body2" color="text.secondary">
              +543416837015
            </Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        {isAuthenticated && (
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem('access_token');
              logout({logoutParams: {returnTo: window.location.origin}});
            }}
            sx={{ 
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            Cerrar Sesión
          </Button>
        )}
      </Box>
    </Box>
  );
}