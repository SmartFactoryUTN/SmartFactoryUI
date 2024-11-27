import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fade,
  SxProps
} from '@mui/material';
import { useUserContext } from "../components/Login/UserProvider";
import WorkflowSection from "./WorkflowSection"
import HeroSection from "./HeroSection"
import StorylaneDemoSection from "./StorylaneDemoSection"
// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import GridOnIcon from '@mui/icons-material/GridOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import TuneIcon from '@mui/icons-material/Tune';
import ScaleIcon from '@mui/icons-material/Scale';

interface WorkflowStepProps {
  icon: ReactNode;
  title: string;
  description: string;
  isVisible: boolean;
}

interface DotNavigationProps {
  currentSection: number;
  totalSections: number;
  onDotClick: (index: number) => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ icon, title, description, isVisible }) => (
  <Fade in={isVisible} timeout={1000}>
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      mb: 4,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s, transform 0.5s'
    }}>
      <Box sx={{
        p: 2,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  </Fade>
);

const DotNavigation: React.FC<DotNavigationProps> = ({ currentSection, totalSections, onDotClick }) => (
  <Box sx={{
    position: 'fixed',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    zIndex: 1000
  }}>
    {[...Array(totalSections)].map((_, index) => (
      <Box
        key={index}
        onClick={() => onDotClick(index)}
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: currentSection === index ? 'primary.main' : 'grey.300',
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'scale(1.2)',
          }
        }}
      />
    ))}
  </Box>
);

const Login: React.FC = () => {
  const { userData } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [sectionVisibility, setSectionVisibility] = useState([true, false, false]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [userData]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          if (currentScrollPos >= sectionTop - windowHeight / 2) {
            setCurrentSection(index);
            setSectionVisibility(prev => ({
              ...prev,
              [index]: true
            }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Common section styles
  const sectionStyles: SxProps = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    scrollSnapAlign: 'start'
  };

  // Add global styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
      }
      html {
        scroll-behavior: smooth;
        scroll-snap-type: y mandatory;
      }
      section { scroll-snap-align: start; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // ... rest of the component remains the same, just update refs like this:
  return (
    <>
      <DotNavigation 
        currentSection={currentSection} 
        totalSections={3} 
        onDotClick={scrollToSection}
      />
      
    <Box
        ref={(el: HTMLDivElement | null) => sectionsRef.current[0] = el}
        sx={{ ...sectionStyles, px: 3 }}
    >
    <HeroSection 
        userData={userData}
    />
    </Box>

    <Box
        ref={(el: HTMLDivElement | null) => sectionsRef.current[1] = el}
        sx={{ ...sectionStyles, px: { xs: 3, md: 15 }, py: 8, bgcolor: 'grey.50' }}
    >
        <WorkflowSection sectionVisibility={sectionVisibility} />   
    </Box>

    <Box
        ref={(el: HTMLDivElement | null) => sectionsRef.current[2] = el}
        sx={{ ...sectionStyles, px: { xs: 3, md: 15 }, py: 8 }}
        >
          <StorylaneDemoSection />  
    </Box>

    </>
  );
};

export default Login;