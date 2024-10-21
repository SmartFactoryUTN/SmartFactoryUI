import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaDecoComparativa from '../components/TablaDecoComparativa';
import PageLayout from '../components/layout/PageLayout';

import { 
  Typography, 
  Box,
  // Link,
  IconButton,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Tutorial: React.FC = () => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const navigate = useNavigate();
  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
  };

  return (
  <PageLayout>
    {/* Title and Button */}
    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: 2 }}>
      <IconButton onClick={() => navigate('/moldes')} sx={{ mr: 2, mb: 2 }}>
        <ArrowBackIcon />
      </IconButton> 
      <Typography color="black" variant="h4">¿Cómo digitalizar mis moldes?</Typography>
    </Box>
    <Typography paragraph>
      El primer paso para digitalizar procesos textiles es contar con moldes digitalizados. A continuación, presentamos una alternativa gratuita,
      utilizando el software Inkscape.
      Existen múltiples alternativas para digitalizar moldes de textiles. A continuación mostramos una tabla comparativa de las opciones existentes para que puedas diseñar tus prendas y obtener moldes en formato digital.
      <TablaDecoComparativa></TablaDecoComparativa>

    </Typography>


    <Typography variant="h6" component="h1" gutterBottom>
      ¿Por qué digitalizar mis moldes con Inkscape?
    </Typography>
    <Typography paragraph>
    </Typography>
    <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
      <img src="/api/placeholder/600/400" alt="Ejemplo de molde digitalizado" style={{ maxWidth: '100%', height: 'auto' }} />
    </Box>

    
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