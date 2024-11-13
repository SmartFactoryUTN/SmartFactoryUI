import {GridValueFormatter} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

type TizadaStatus = 'CREATED' | 'IN_PROGRESS' | 'FINISHED' | 'ERROR';
 
type StatusConfig = {
  [key in TizadaStatus]: {
    label: string;
    color: string;
  }
};

export const getStatusDisplay = (status: TizadaStatus) => {
  const statusConfig: StatusConfig = {
    CREATED: { label: 'Por tizar', color: '#ed6c02' },
    IN_PROGRESS: { label: 'Optimizando', color: '#ff9800' },
    FINISHED: { label: 'Terminada', color: '#2e7d32' },
    ERROR: { label: 'Error', color: '#d32f2f' }
  };
  
  return (
    <Typography
      component="span"
      sx={{
      fontSize: 'inherit',
      lineHeight: 'inherit'
      //color: statusConfig[status].color,
      }}
    >
    {statusConfig[status].label}
    </Typography>
  );
};

export const formatDate = (value: string | null) => {
  if (!value) return 'Sin cambios';
  try {
    const date = new Date(value);
    date.setHours(date.getHours() - 3);
    return date.toLocaleString();
  } catch (error) {
    return 'Sin cambios';
  }
};

export const formatArea: GridValueFormatter = (value: unknown) => {
  if (value == null) return 'N/A';
  return typeof value === 'number' ? value.toFixed(2) : String(value);
};

export const formatTimeAgo = (date: string | null) => {
  if (!date) return '';
  
  const now = new Date();
  // Parse the UTC date and adjust to local timezone
  const past = new Date(date);
  // Adjust for timezone difference
  past.setHours(past.getHours() - 3); // Assuming GMT-3, adjust as needed

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  console.log('Time difference in seconds:', diffInSeconds); // For debugging

  if (diffInSeconds < 0) return 'iniciando optimización...';
  if (diffInSeconds < 60) {
    return `hace ${diffInSeconds} ${diffInSeconds === 1 ? 'segundo' : 'segundos'}`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  
  return formatDate(date);
};

export const formatTimeRemaining = (endTime: string | null) => {
  if (!endTime) return '';
  
  const now = new Date();
  const end = new Date(endTime);
  // Convert end time to local timezone
  const localEnd = new Date(end.getTime() - (end.getTimezoneOffset() * 60000));
  const diffInSeconds = Math.floor((localEnd.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds <= 0) return 'finalizando...';
  if (diffInSeconds < 60) return `${diffInSeconds} segundos restantes`;
  const minutes = Math.ceil(diffInSeconds / 60);
  return `${minutes} ${minutes === 1 ? 'minuto restante' : 'minutos restantes'}`;
};

// TODO: Remove this file once backend handles SVG saving properly
export const fixTizadaSVGViewbox = async (svgUrl: string): Promise<string> => {
  try {
    const response = await fetch(svgUrl);
    const svgText = await response.text();
    
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    const binElement = svgDoc.querySelector('.bin');
    
    if (svgElement && binElement) {
      const binWidth = parseFloat(binElement.getAttribute('width') || '0');
      const binHeight = parseFloat(binElement.getAttribute('height') || '0');
      
      if (binWidth && binHeight) {
        svgElement.setAttribute('width', binWidth.toString());
        svgElement.setAttribute('height', binHeight.toString());
        svgElement.setAttribute('viewBox', `0 0 ${binWidth} ${binHeight}`);
        
        const modifiedSvgText = new XMLSerializer().serializeToString(svgDoc);
        const blob = new Blob([modifiedSvgText], { type: 'image/svg+xml' });
        return URL.createObjectURL(blob);
      }
    }
    throw new Error('Could not find necessary SVG elements');
  } catch (err) {
    console.error('Error fixing tizada SVG:', err);
    throw err;
  }
};