import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaDecoComparativa from '../components/TablaDecoComparativa';
import PageLayout from '../components/layout/PageLayout';

import { 
  Typography, 
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Tutorial: React.FC = () => {
  const navigate = useNavigate();

  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const handleFeedback = (type: 'like' | 'dislike' | null) => {
    if (feedback === null) {
      setFeedback(type);
      if (type === 'dislike') {
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedback(null);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = () => {
    // Here you would typically send the comment to your backend
    console.log('Submitted comment:', comment);
    setIsModalOpen(false);
    setComment('');
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
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        El primer paso para digitalizar procesos textiles es contar con moldes digitalizados. Siguiendo este tutorial paso a paso, se pueden obtener moldes digitales en cuestión de minutos. Es nececsario descargar e instalar de forma gratuita el software Inkscape.
      </Typography>

      {/*QUE ES UNA IMÁGEN VECTORIAL */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
        ¿Qué es un molde digital?
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        // Explicar qué es un molde digital, introduciendo el concepto de imágen vectorial brevemente
        // Explicar qué tipo de archivos acepta nuestra plataforma (svg)
      </Typography>

      {/*POR QUE INKSCAPE */}
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4, textAlign: 'left' }}>
        ¿Por qué digitalizar mis moldes con Inkscape?
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
      Existen múltiples alternativas para digitalizar moldes de textiles. A continuación mostramos una tabla comparativa de algunas alternativas para diseñar prendas y obtener moldes en formato digital.
      </Typography>
      <TablaDecoComparativa />
      <Typography paragraph sx={{ textAlign: 'justify' }}>
        AccuMark o Lectra son alternativas pagas que están orientadas a la creación de prendas digitales, imitando el proceso de confección de moldes real. También existe la opción gratuita Seamly2D, que comenzó como el proyecto denominado Valentina,
        la cual posee una amplia comunidad online que comparte sus creaciones, tutoriales y brindan soporte de forma gratuita, tanto en inglés como español.
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}>
      Para utilizar SmartFactory no hace falta aprender a utilizar una herramienta de diseño profesional. Inkscape es una alternativa con la que se pueden generar imágenes SVG de propósito general. Si bien posee muchas opciones avanzadas para trabajar en tareas complejas, 
        es muy sencilla de utilizar para la digitalización de moldes.
      </Typography>
      <Typography paragraph sx={{ textAlign: 'justify' }}> 
      Siguiendo los pasos a continuación, se pueden obtener moldes en formato SVG listos para ser cargados a SmartFactory y utilizados en una tizada en cuestión de minutos. 
      </Typography>

      
      {/*FOOTER like/dislike */}    
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
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          Contanos qué te gustaría aprender acerca de la digitalización de moldes
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Tu comentario"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={handleCommentChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSubmitComment} variant="contained">Enviar comentarios</Button>
        </DialogActions>
      </Dialog>
  </PageLayout>
  );
};

export default Tutorial;