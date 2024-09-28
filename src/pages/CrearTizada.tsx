import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoldes } from '../api/methods';
import { Molde } from '../utils/types';

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type TizadaType = 'RAPIDA' | 'EFICIENTE' | 'PERSONALIZADO';

interface MoldSelection {
  uuid: string;
  quantity: number;
}

{/* Parametros para crear nueva tizada */}

interface FormData {
  name: string;
  width: number;
  height: number;
  tizadaType: TizadaType;
  wastePercentage: number | null;
  molds: MoldSelection[];
}

function CrearTizada() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({ // Setear valores default
        name: '',
        width: 0,
        height: 0,
        tizadaType: 'RAPIDA',
        wastePercentage: null,
        molds: [{ uuid: '', quantity: 1 }],
    });

    {/* Mostrar moldes disponibles del usuario */}
    const [availableMolds, setAvailableMolds] = useState<Molde[]>([]);

    useEffect(() => {
        fetchMolds();
    }, []);

    const fetchMolds = async () => {
        try {
          const result = await getMoldes();
          if (result.status === 'ok') {
            setAvailableMolds(result.data);
          } else {
            console.error('Failed to fetch molds');
          }
        } catch (error) {
          console.error('Error fetching molds:', error);
        }
      };

    {/* Actualizar los valores en el formulario */}
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    {/* Si la tizada es tipo custom, mostrar */}
    const handleTizadaTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newType: TizadaType,
    ) => {
        if (newType !== null) {
        setFormData((prev) => ({ ...prev, tizadaType: newType }));
        }
    };


    const handleMoldChange = (index: number, field: 'uuid' | 'quantity', value: string | number) => {
        const newMolds = [...formData.molds];
        newMolds[index] = { ...newMolds[index], [field]: value };
        setFormData((prev) => ({ ...prev, molds: newMolds }));
    };

    const addMold = () => {
        setFormData((prev) => ({
        ...prev,
        molds: [...prev.molds, { uuid: '', quantity: 1 }],
        }));
    };

    const removeMold = (index: number) => {
        const newMolds = formData.molds.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, molds: newMolds }));
    };
      
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData); // Replace with actual API call
        // TODO: Implement API call to create Tizada
        navigate('/tizadas'); // Navigate back to Tizadas list after creation
    };

    return (
        <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
            Crear Nueva Tizada
            </Typography>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Dimensiones de la mesa de corte
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Ancho (cm)"
                        name="width"
                        type="number"
                        value={formData.width}
                        onChange={handleInputChange}
                        required
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Alto (cm)"
                        name="height"
                        type="number"
                        value={formData.height}
                        onChange={handleInputChange}
                        required
                    />
                    </Grid>
                </Grid>
                </Grid>
                <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Tipo de Tizada
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={formData.tizadaType}
                    exclusive
                    onChange={handleTizadaTypeChange}
                    aria-label="Tipo de Tizada"
                >
                    <ToggleButton value="RAPIDA">Rápida</ToggleButton>
                    <ToggleButton value="EFICIENTE">Eficiente</ToggleButton>
                    <ToggleButton value="PERSONALIZADO">Personalizado</ToggleButton>
                </ToggleButtonGroup>
                </Grid>
                {formData.tizadaType === 'PERSONALIZADO' && (
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    label="Porcentaje de desperdicio deseado"
                    name="wastePercentage"
                    type="number"
                    value={formData.wastePercentage || ''}
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: <Typography>%</Typography>,
                    }}
                    />
                </Grid>
                )}
                <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Moldes
              </Typography>
              {formData.molds.map((mold, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Seleccionar Molde</InputLabel>
                      <Select
                        value={mold.uuid}
                        onChange={(e) => handleMoldChange(index, 'uuid', e.target.value as string)}
                        label="Seleccionar Molde"
                      >
                        {availableMolds.map((availableMold) => (
                          <MenuItem key={availableMold.uuid} value={availableMold.uuid}>
                            {availableMold.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      type="number"
                      value={mold.quantity}
                      onChange={(e) => handleMoldChange(index, 'quantity', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => removeMold(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addMold}
                  variant="outlined"
                >
                  Agregar Molde
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  onClick={() => navigate('/tizadas')}
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Crear Tizada
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
    );
}

export default CrearTizada;