import React from 'react';
import { Box, Typography } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import GridOnIcon from '@mui/icons-material/GridOn';
import InventoryIcon from '@mui/icons-material/Inventory';

interface WorkflowStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isVisible: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ number, icon, title, description, isVisible }) => (
  <Box 
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      mb: 8,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s, transform 0.5s'
    }}
  >
    {/* Large number */}
    <Typography
      variant="h1"
      sx={{
        fontSize: '120px',
        fontWeight: 700,
        color: 'secondary.main',
        opacity: 0.3,
        lineHeight: 1,
        minWidth: '120px',
        textAlign: 'center'
      }}
    >
      {number}
    </Typography>

    {/* Content container */}
    <Box sx={{ flex: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        mb: 1
      }}>
        <Typography 
          variant="h5"
          sx={{
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          color: 'secondary.main'
        }}>
          {icon}
        </Box>
      </Box>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary',
          maxWidth: '600px'
        }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);

const WorkflowSection: React.FC<{ sectionVisibility: boolean[] }> = ({ sectionVisibility }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      px: { xs: 3, md: 6 },
      py: 8
    }}
  >
    <WorkflowStep
      number="1"
      icon={<ContentCutIcon sx={{ fontSize: 26 }} />}
      title="Digitalice sus moldes"
      description="Comience digitalizando sus moldes. Una vez cargados, podrá utilizarlos para crear tizadas optimizadas."
      isVisible={sectionVisibility[0]}
    />

    <WorkflowStep
      number="2"
      icon={<GridOnIcon sx={{ fontSize: 26 }} />}
      title="Cree y optimice tizadas"
      description="Cree una nueva tizada seleccionando los moldes necesarios. Puede guardar la configuración o ejecutar la optimización inmediatamente."
      isVisible={sectionVisibility[1]}
    />

    <WorkflowStep
      number="3"
      icon={<InventoryIcon sx={{ fontSize: 26 }} />}
      title="Gestione su inventario"
      description="Cree y administre rollos de tela y prendas en cualquier momento, manteniendo un control preciso de su stock."
      isVisible={sectionVisibility[1]}
    />
  </Box>
);

export default WorkflowSection;