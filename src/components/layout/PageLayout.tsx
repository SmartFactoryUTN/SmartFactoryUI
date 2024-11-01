import React from 'react';
import {Box, Container, useTheme} from '@mui/material';

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
      pt: { xs: 12, sm: 13 }, // Adjustable top padding for different breakpoints 
      pb: 3,
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      minHeight: '90vh'
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
