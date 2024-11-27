import { Box, Typography } from '@mui/material';
import { SectionTitle, MainTitle } from '../components/TitleTypographies';

interface HeroSectionProps {
  userData: {
    name: string;
  } | null;
}


const HeroSection: React.FC<HeroSectionProps> = ({ userData }) => 
    (

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
        ><SectionTitle>
            Bienvenido,
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
                {userData?.name}
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
        ><SectionTitle>
            Ya puede comenzar a optimizar sus procesos textiles
        </SectionTitle>
        </Typography>
    </Box>
);

export default HeroSection;