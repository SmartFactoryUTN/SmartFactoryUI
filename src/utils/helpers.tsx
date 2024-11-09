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
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hace menos de un minuto';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `hace ${Math.floor(diffInSeconds / 86400)} días`;
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