import React from 'react';
import { Box, Container, useTheme } from '@mui/material';

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  centered?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  maxWidth = 'md', 
  centered = false 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      paddingTop: theme.spacing(11), // Ajusta este valor según la altura de tu navbar
      paddingBottom: theme.spacing(4),
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Container 
        maxWidth={maxWidth}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(centered && {
            justifyContent: 'center',
            alignItems: 'center',
          }),
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;