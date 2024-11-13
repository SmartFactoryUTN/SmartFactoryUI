import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createTizada, getMoldes, invokeTizada} from '../api/methods';
import {Molde} from '../utils/types';
import PageLayout from '../components/layout/PageLayout';
import OptimizationSlider from '../components/OptimizationSlider';

import {useUserContext} from "../components/Login/UserProvider.tsx";

import {
    Alert,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';


const AVAILABLE_CREDITS = 20; // Hardcoded for testing

// type TizadaType = 'RAPIDA' | 'EFICIENTE' | 'PERSONALIZADO';

interface MoldSelection {
    uuid: string;
    quantity: number;
}

{/* Parametros para crear nueva tizada */
}

interface FormData {
    name: string;
    width: number;
    height: number;
    utilizationPercentage: number | null;
    maxTime: number;
    //userUUID: string;
    molds: MoldSelection[];
    maxIterations: number;
}

{/*
interface TimeInput {
  minutes: number | null;
  seconds: number | null;
}*/
}

function CrearTizada() {
    //const tooltipTiempoMax = "." //Se guardarán los resultados aunque no se haya alcanzado el porcentaje de aprovechamiento deseado.";
    //const tooltipPorcen = "Obtener la mejor tizada posible toma 12 minutos. Si desea terminar antes, ingrese el porcentaje de aprovechamiento buscado.";
    {/*const [timeInput, setTimeInput] = useState<TimeInput>({
    minutes: 12,
    seconds: 0
  });*/
    }
    const [optimizationTime, setOptimizationTime] = useState(7); // Default to a moderate value


    const navigate = useNavigate();
    // Setear valores default
    const [formData, setFormData] = useState<FormData>({
        name: '',
        width: 100,
        height: 50,
        utilizationPercentage: null,
        maxTime: 12 * 60 * 1000, // 12 minutos en milisegundos
        molds: [{uuid: '', quantity: 1}],
        maxIterations: 10,
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isSaveAndOptimize, setIsSaveAndOptimize] = useState<boolean>(false);
    const {userData} = useUserContext();

    {/* Mostrar moldes disponibles del usuario */
    }
    const [availableMolds, setAvailableMolds] = useState<Molde[]>([]);

    useEffect(() => {
        fetchMolds();
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchMolds = useCallback(async () => {
            if (isLoading) return; // Prevent multiple simultaneous calls
            setIsLoading(true);
            try {
                // @ts-expect-error "skipped"
                const result = await getMoldes(userData?.id);
                console.log('Fetched molds:', result);
                if (result.status === 'success') {
                    // @ts-expect-error "skipped"
                    setAvailableMolds(result.data.moldes);
                } else {
                    console.error('Failed to fetch molds');
                    setError('Error al cargar sus moldes. Por favor, cargue la página nuevamente.');
                }
            } catch (error) {
                console.error('Error fetching molds:', error);
                setError('Error al cargar sus moldes. Por favor, cargue la página nuevamente.');
            } finally {
                setIsLoading(false);
            }
        }, []
    );

    {/* Actualizar los valores en el formulario */
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        //if (name === 'maxTime') {
        //  if (value === '') {
        //    setFormData(prev => ({ ...prev, [name]: 0 }));
        //  } else {
        //    const numValue = parseInt(value);
        //    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
        //      setFormData(prev => ({ ...prev, [name]: numValue }));
        //    }
        //  }
        //} else
        if (name === 'utilizationPercentage') {
            if (value === '') {
                setFormData(prev => ({...prev, [name]: 0}));
            } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                    setFormData(prev => ({...prev, [name]: Number(numValue.toFixed(1))}));
                }
            }
        } else {
            setFormData((prev) => ({...prev, [name]: value}));
        }
    };


    {/* Si la tizada es tipo custom, mostrar campos adicionales */
    }
    {/*
    const handleTizadaTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newType: TizadaType,
    ) => {
        if (newType !== null) {
        setFormData((prev) => ({ ...prev, tizadaType: newType }));
        }
    };
    */
    }

    {/* Deshabilitar incrementar tiempo: maximo de 12 minutos */
    }
    {/*const handleTimeChange = (field: keyof TimeInput, amount: number) => {
    setTimeInput(prev => {
      const currentValue = prev[field] ?? 0;
      const maxValue = field === 'minutes' ? 12 : 59;
      const newValue = Math.max(0, Math.min(maxValue, currentValue + amount));
      return { ...prev, [field]: newValue };
    });
  };
  const handleTimeInputChange = (field: keyof TimeInput, value: string | number | null) => {
    const numValue = value === '' ? null : typeof value === 'string' ? parseInt(value) : value;
    if (numValue !== null) {
      const maxValue = field === 'minutes' ? 12 : 59;
      const clampedValue = Math.max(0, Math.min(maxValue, numValue));
      setTimeInput(prev => ({
        ...prev,
        [field]: clampedValue
      }));
    } else {
      setTimeInput(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }; */
    }
    {/* Lo mismo pero para porcentaje
  const handlePercentageChange = (amount: number) => {
    setFormData((prev) => {
      const currentValue = prev.utilizationPercentage ?? 0;
      const newValue = Math.max(0, Math.min(100, currentValue + amount));
      return { ...prev, utilizationPercentage: Number(newValue.toFixed(1)) };
    });
  };*/
    }

    {/* Logica de carga de moldes */
    }
    const handleMoldChange = (index: number, field: 'uuid' | 'quantity', value: string | number) => {
        const newMolds = [...formData.molds];
        newMolds[index] = {...newMolds[index], [field]: value};
        setFormData((prev) => ({...prev, molds: newMolds}));
    };
    const addMold = () => {
        setFormData((prev) => ({
            ...prev,
            molds: [...prev.molds, {uuid: '', quantity: 1}],
        }));
    };
    const removeMold = (index: number) => {
        const newMolds = formData.molds.filter((_, i) => i !== index);
        setFormData((prev) => ({...prev, molds: newMolds}));
    };

    {/* LLamada a la api */
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSaveAndOptimize(false);

        const maxTime = optimizationTime * 60 * 1000;

        if (formData.molds.some(mold => mold.uuid === '' || mold.quantity < 1)) {
            setError("Por favor, seleccione un molde y especifíque una cantidad.");
            return;
        }

        const dataToSend = {
            ...formData,
            maxTime
        };

        try {
            const response = await createTizada(dataToSend);

            if (response.status === 'success' && response.data) {
                setSuccess(true);
                // response.data is the UUID string directly
                const uuid = response.data;
                setTimeout(() => {
                    navigate(`/tizadas/tizada/${uuid}`);
                }, 2000);
            } else {
                setError("Error al crear la tizada. Por favor, intentelo nuevamente.");
            }
        } catch (error) {
            console.error('Error creando la tizada:', error);
            setError("Un error ocurrió al crear la tizada, intentelo de nuevo por favor.");
        }
    };

    const handleSaveAndCptimize = async () => {
        setError(null);
        setSuccess(false);

        const maxTime = optimizationTime * 60 * 1000;
        let uuid: string | null = null;

        if (formData.molds.some(mold => mold.uuid === '' || mold.quantity < 1)) {
            setError("Por favor, seleccione un molde y especifíque una cantidad.");
            return;
        }

        const dataToSend = {
            ...formData,
            maxTime
        };

        try {
            const response = await createTizada(dataToSend);

            if (response.status === 'success' && response.data) {
                setIsSaveAndOptimize(true);
                // response.data is the UUID string directly
                uuid = response.data
                try {
                    const response = await invokeTizada(uuid, userData?.id ?? '');
                    if (response.status === 'success') {
                        setSuccess(true);
                        setTimeout(() => {
                            navigate('/tizadas');
                        }, 1500);
                    } else {
                        setError("Failed to start tizada generation. Please try again.");
                    }
                } catch (error) {
                    console.error('Error starting tizada generation:', error);
                    setError("An error occurred while starting tizada generation. Please try again.");
                }
            } else {
                setError("Error al crear la tizada. Por favor, intentelo nuevamente.");
            }
        } catch (error) {
            console.error('Error creando la tizada:', error);
            setError("Un error ocurrió al crear la tizada, intentelo de nuevo por favor.");
        }
    }

    return (
        <PageLayout>
            {/* Title  */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <Typography color="black" variant="h4">Crear una Tizada Nueva</Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography sx={{flexGrow: 1, textAlign: 'left', mb: 2, fontWeight: 'bold'}}>
                            Nombre
                        </Typography>

                        <TextField
                            fullWidth
                            label="Ingrese un nombre para su tizada"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    {/* Dimensiones de la mesa de corte */}
                    <Grid item xs={12}>
                        <Typography sx={{flexGrow: 1, textAlign: 'left', mb: 2, fontWeight: 'bold'}}>
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


                    {/*Mostrar campos acorde al tipo de tizada*/}
                    {/* {formData.tizadaType === 'PERSONALIZADO' && ( */}
                    {/*Campos de tizada personalizada*/}
                    {/*)}*/}

                    {/*Porcentaje de aprovechamiento
          <Grid item xs={12} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ flexGrow: 1, textAlign: 'left' }}> Porcentaje de aprovechamiento
                <Tooltip title={tooltipPorcen}>
                  <IconButton size="small" sx={{ "& .MuiInputBase-input": { fontSize: 10, height: 4, padding: 1 } }}      >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Porcentaje de aprovechamiento deseado"
              name="utilizationPercentage"
              type="number"
              value={formData.utilizationPercentage}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => handlePercentageChange(-0.1)}
                      edge="start"
                      disabled={formData.utilizationPercentage === null || formData.utilizationPercentage <= 0}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography sx={{ mr: 1 }}>%</Typography>
                    <IconButton
                      onClick={() => handlePercentageChange(0.1)}
                      edge="end"
                      disabled={formData.utilizationPercentage !== null && formData.utilizationPercentage >= 100}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                inputProps: {
                  min: 0,
                  max: 100,
                  step: 0.1,
                  style: { textAlign: 'center' },
                }
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none',
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
            />
          </Grid>*/}

                    {/*Tiempo: minutos*/}
                    {/* Optimización */}
                    {/* Optimización */}
                    <Grid item xs={12}>
                        <OptimizationSlider
                            value={optimizationTime}
                            onChange={(newValue) => {
                                setOptimizationTime(newValue);
                                setFormData(prev => ({
                                    ...prev,
                                    maxTime: newValue * 60 * 1000 // Convertir a milisegundos
                                }));
                            }}
                            availableCredits={AVAILABLE_CREDITS}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <Typography sx={{flexGrow: 1, textAlign: 'left', fontWeight: 'bold'}}>
                                Moldes
                                {/*<Tooltip title={tooltipMoldes}>
      <IconButton size="small" sx={{ "& .MuiInputBase-input": { fontSize: 10, height: 4, padding: 1 } }}      >
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    */}
                            </Typography>
                        </Box>
                        {formData.molds.map((mold, index) => (
                            <Grid container spacing={2} key={index} sx={{mb: 2}} alignItems="center">
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Seleccionar Molde</InputLabel>
                                        <Select
                                            value={mold.uuid}
                                            onChange={(e) => handleMoldChange(index, 'uuid', e.target.value as string)}
                                            label="Seleccionar Molde"
                                        >
                                            {availableMolds
                                                .slice()
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((availableMold) => (
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
                                        InputProps={{inputProps: {min: 1}}}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => removeMold(index)} color="error">
                                        <DeleteIcon/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Box sx={{mt: 2}}>
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={addMold}
                                variant="outlined"
                            >
                                Agregar Molde
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                            <Button
                                type="button"
                                onClick={() => navigate('/tizadas')}
                                sx={{mr: 2}}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="primary" sx={{mr: 2}}>
                                Guardar
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSaveAndCptimize}>
                                Guardar y tizar
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{width: '100%'}}>
                    {isSaveAndOptimize ? '¡Nueva tizada creada y ejecutada!' : '¡Nueva tizada creada!'}
                </Alert>
            </Snackbar>
        </PageLayout>
    );
}

export default CrearTizada;
