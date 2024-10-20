import React, { useState } from 'react';
import { 
  Typography, 
  Box,
  // Link,
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
      <Typography variant="h5" component="h1" gutterBottom>
        Cómo digitalizar tus moldes para SmartFactory
      </Typography>

      <Typography paragraph>
        Para usar nuestro software de optimización de corte, necesitás tus patrones en formato SVG. 
        Te recomendamos usar Seamly2D: un software gratuito y fácil de usar. Seamly2D es una herramienta especializada en la confección de moldes para indumentaria. De esta manera, cuenta con una amplia y activa comunidad, y diversas guías se encuentran disponibles en español. 
        Es posible aprender a digitalizar y crear moldes con alta presición, siguiendo las metodologías estándar para confección de moldes, a través de tutoriales en formato de texto o video.
        En SmartFactory disponibilizamos a continuación una guía paso a paso, con la información escencial para que puedas digitalizar tus moldes en tan solo 5 a 10 minutos.
      </Typography>

      <Typography paragraph>
        Para obtener tu archivo SVG, comenzá descargando Seamly2D en este enlace, ejecutá el archivo que se descargará desde tu navegador y seguí los pasos para instalar el software. 
        A continuación, abrí Seamly2D. Necesitarás una foto de los moldes que quieras digitalizar, vista desde arriba como se muestra a continuación.
        Importá tu foto para crear un trazo de los contornos del molde haiendo click en "Tools/Images/Import Image"
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