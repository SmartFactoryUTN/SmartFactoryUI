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
    CREATED: { label: 'Creada', color: '#ed6c02' },
    IN_PROGRESS: { label: 'En curso', color: '#ff9800' },
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