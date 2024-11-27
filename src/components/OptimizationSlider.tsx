import React, { useEffect, useState } from 'react';
import {
  Box,
  Slider,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  Chip
} from '@mui/material';
import { SubSectionTitle } from '../components/TitleTypographies';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import {useUserContext} from "../components/Login/UserProvider.tsx";

export interface OptimizationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const OptimizationSlider: React.FC<OptimizationSliderProps> = ({
  value,
  onChange,
}) => {

  const [availableCredits, setAvailableCredits] = useState<number>(100); // Default to 100
  const [loading, setLoading] = useState(true);
  const {userData} = useUserContext();


  useEffect(() => {
    if (userData) {
      if (userData.credits !== undefined) {
        setAvailableCredits(userData.credits);
      }
      setLoading(false); 
    }
  }, [userData]);
  
  const getQualityLevel = (val: number) => {
    if (val >= 10) return 'Óptima';
    if (val >= 6) return 'Alta';
    if (val >= 4) return 'Media';
    return 'Básica';
  };

  const getQualityColor = (val: number) => {
    if (val >= 10) return 'success';
    if (val >= 6) return 'primary';
    if (val >= 4) return 'warning';
    return 'error';
  };

  const remainingCredits = availableCredits - value;
  const isInsufficientCredits = remainingCredits < 0;
  
  if (loading) {
    return <Typography>Cargando créditos...</Typography>; 
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            
          <SubSectionTitle>
            Tiempo de optimización
            </SubSectionTitle>
            <Tooltip title="Cuánto tiempo dedicará el sistema a optimizar la disposición de los moldes. Se consume 1 crédito por minuto.">
              <IconButton size="small" sx={{float:'left', ml: -50, mb:2 }}>
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BoltIcon sx={{ color: 'secondary.main' }} />
            <Typography>
              Créditos disponibles: {availableCredits}
            </Typography>
          </Box>
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
              width: '50%'
            }}
          />
          <TextField
            value={value}
            disabled
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">minutos</InputAdornment>,
              readOnly: true,
              sx: { width: '120px' }
            }}
          />
          <Chip
            icon={<BoltIcon />}
            label={`Costo: ${value} créditos`}
            color={isInsufficientCredits ? 'error' : 'default'}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Calidad de optimización:&nbsp;
          </Typography>
          <Chip
            label={getQualityLevel(value)}
            color={getQualityColor(value)}
            size="small"
          />
        </Box>

        {isInsufficientCredits ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            No tienes suficientes créditos para esta optimización. Necesitas {Math.abs(remainingCredits)} créditos adicionales.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            Créditos restantes después de la optimización: {remainingCredits}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default OptimizationSlider;