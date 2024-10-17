import React, { useState } from 'react';
import { 
  Typography, 
  Box,
  Link,
  IconButton,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PageLayout from '../components/layout/PageLayout';

const Tutorial: React.FC = () => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
  };

  return (
    <PageLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Cómo digitalizar tus moldes para SmartFactory
      </Typography>

      <Typography paragraph>
        Para usar nuestro software de optimización de corte, necesitás tus patrones en formato SVG. 
        Te recomendamos usar Seamly2D: un software gratuito y fácil de usar. Siguiendo esta guía, 
        podrás digitalizar tus moldes en aproximadamente 20 minutos.
      </Typography>

      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <img src="/api/placeholder/600/400" alt="Ejemplo de molde digitalizado" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>

      {/* ... (resto del contenido) ... */}

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body1" gutterBottom>
          ¿Te resultó útil este tutorial?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => handleFeedback('like')}
            color={feedback === 'like' ? 'primary' : 'default'}
            sx={{ opacity: feedback === 'dislike' ? 0.5 : 1 }}
          >
            <ThumbUpIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleFeedback('dislike')}
            color={feedback === 'dislike' ? 'primary' : 'default'}
            sx={{ opacity: feedback === 'like' ? 0.5 : 1 }}
          >
            <ThumbDownIcon />
          </IconButton>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Tutorial;