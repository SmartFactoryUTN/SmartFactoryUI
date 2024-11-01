import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Tizada } from '../utils/types';

interface TizadaDisplayProps {
  tizada: Tizada | null;
  svgUrl: string | null;
  onStartProgress: () => void;
}

const TizadaDisplay = ({ tizada, svgUrl, onStartProgress }: TizadaDisplayProps) => {
  const getContent = () => {
    if (!tizada) return null;

    switch (tizada.state) {
      case 'CREATED':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ¿Todo listo para comenzar? Confirme que los datos sean correctos para empezar a generar su tizada.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={onStartProgress}
            >
              GENERAR TIZADA
            </Button>
          </Box>
        );

      case 'IN_PROGRESS':
        return <CircularProgress />;

      case 'FINISHED':
        if (svgUrl) {
          return (
            <object
              type="image/svg+xml"
              data={svgUrl}
              style={{
                width: '100%',
                height: '100%',
                margin: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            >
              Su navegador no soporta SVGs
            </object>
          );
        }
        return null;

      case 'ERROR':
        return (
          <Typography variant="h6" align="center">
            Error en la generación de la tizada
          </Typography>
        );

      default:
        return (
          <Typography variant="h6" align="center">
            Estado desconocido
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      p: 2 
    }}>
      {getContent()}
    </Box>
  );
};

export default TizadaDisplay;