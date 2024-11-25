import {Typography, } from '@mui/material';
import { typography } from '../utils/fonts';

// Componente reutilizable para títulos principales
export const MainTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography 
      variant="h4" 
      sx={{ 
        ...typography.h1,  // Usa la configuración definida para h1
        mb: 3
      }}
    >
      {children}
    </Typography>
  );
  
  // Componente para subtítulos de sección
  export  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography 
      variant="h5" 
      sx={{ 
        ...typography.h2,  // Usa la configuración definida para h2
        mb: 2
      }}
    >
      {children}
    </Typography>
  );

  // Componente para sub-subtítulos de sección
  export  const SubSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography 
      variant="h5" 
      sx={{ 
        ...typography.h3,  // Usa la configuración definida para h2
        mb: 2,
        textAlign: 'left',
        display: 'block' // Ensure block-level display
      }}
    >
      {children}
    </Typography>
  );
  
  // Componente para descripciones de sección
  export  const SectionDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography 
      variant="body2" 
      sx={{ 
        ...typography.body2,  // Usa la configuración definida para body2
        mb: 2
      }}
    >
      {children}
    </Typography>
  );