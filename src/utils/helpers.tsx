import {GridValueFormatter} from '@mui/x-data-grid';


export const formatDate: GridValueFormatter = (value: string | null) => {
    if (value == null) return 'N/A';
    try {
      return new Date(value).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

export const formatArea: GridValueFormatter = (value: unknown) => {
  if (value == null) return 'N/A';
  return typeof value === 'number' ? value.toFixed(2) : String(value);
};