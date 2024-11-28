import { Box, Typography } from '@mui/material';
import { SectionTitle, MainTitle } from '../components/TitleTypographies';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const NewUser = () => (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'left',
        justifyContent: 'center',
        minHeight: '80vh',
        gap: 4,
        margin: '0 auto'
    }}>
        <Typography 
            variant="h1"
            sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                color: 'text.secondary',
                textAlign: 'left',
                mb: 0
            }}
        >
            <SectionTitle>
                Bienvenido a
            </SectionTitle>
        </Typography>
        <Typography 
            variant="h1"
            sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                WebkitBackgroundClip: 'text',
                color: 'black',
                letterSpacing: '0.01em',
                textAlign: 'center',
                lineHeight: 0.7,
                mb: 0,
            }}
        >
            <MainTitle>
                SmartFactory
            </MainTitle>
        </Typography>
        <Typography 
            variant="h5"
            sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                color: 'text.secondary',
                textAlign: 'center',
                mb: 1,
            }}
        >
            <SectionTitle>
                Solicite una demo para digitalizar su emprendimiento y comenzar a optimizar sus procesos textiles.
            </SectionTitle>
        </Typography>

        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mt: 4
        }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Contáctenos:
            </Typography>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                    1234567890
                </Typography>
            </Box>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">
                    wearesmartfactory@gmail.com
                </Typography>
            </Box>
        </Box>
    </Box>
);

export default NewUser;