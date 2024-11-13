import React from 'react';
import {
  Box,
  Slider,
  Typography,
  //Alert,
  //Paper,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  //LinearProgress
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
//import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface OptimizationSliderProps {
  value: number;
  onChange: (value: number) => void;
  availableCredits?: number;
}

const OptimizationSlider: React.FC<OptimizationSliderProps> = ({
  value,
  onChange,
  //availableCredits = 100
}) => {
  const getQualityLevel = (val: number) => {
    if (val >= 10) return 'Óptima';
    if (val >= 6) return 'Alta';
    if (val >= 4) return 'Media';
    return 'Básica';
  };

  const getQualityColor = (val: number) => {
    if (val >= 10) return 'success.main';
    if (val >= 6) return 'primary.main';
    if (val >= 4) return 'warning.main';
    return 'error.main';
  };

{/*}  const getDescription = (val: number) => {
    if (val >= 10) return "Máxima optimización del material. Ideal para grandes producciones.";
    if (val >= 6) return "Buena optimización del material con uso moderado de créditos.";
    if (val >= 4) return "Balance entre optimización y uso de créditos.";
    return "Optimización básica con uso mínimo de créditos.";
  };*/}

  return (
    <Box sx={{ width: '100%' }}>

        <Box sx={{ mb: 0 }}>
            {/* Main title */}
            <Typography 
                sx={{ 
                    fontWeight: 'bold',
                    flexGrow: 1, 
                    textAlign: 'left',
                    mb: 2  // Consistent with other section spacing
                }}
                >
                Tiempo de optimización
                <Tooltip title="Cuánto tiempo dedicará el sistema a optimizar la disposición de los moldes">
                    <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Typography>

        {/* New layout with number field + shorter slider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

         </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={2}
        max={12}
        step={1}
        marks={[
          { value: 2, label: '2' },
          { value: 12, label: '12' }
        ]}
        sx={{
          '& .MuiSlider-markLabel': {
            fontSize: '0.875rem',
          },
          width: '50%' // Make slider shorter
        }}
      />
      <TextField
        value={value}
        disabled
        size="small"
        InputProps={{
          endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
          readOnly: true,
          sx: { width: '120px' } // Fixed width for the text field
        }}
      />
    </Box>

        {/* New subtitle with quality level */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
                Calidad de optimización:&nbsp;
            </Typography>
            <Typography 
                variant="subtitle1" 
                sx={{ 
                color: getQualityColor(value),
                //fontWeight: 'bold'
                }}
            >
                {getQualityLevel(value)}
            </Typography>
        </Box>
    {/** 
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            bgcolor: 'grey.50',
            mt: 2,
            border: 1,
            borderColor: 'grey.200'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Créditos a utilizar
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {value} de {availableCredits} disponibles
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(value / availableCredits) * 100}
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {getDescription(value)}
          </Typography>
          <Alert 
        severity="info" 
        sx={{ mb: 3 }}
        icon={<AccessTimeIcon />}
      >
        Use más créditos para obtener mejores resultados. A mayor tiempo de optimización, mejor aprovechamiento del material.
      </Alert>
        </Paper>*/}
      </Box>
    </Box>
  );
};

export default OptimizationSlider;