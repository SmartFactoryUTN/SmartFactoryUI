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
    const [nameError, setNameError] = useState(false);
    const [moldSelectionErrors, setMoldSelectionErrors] = useState<boolean[]>([]);
    const [moldQuantityErrors, setMoldQuantityErrors] = useState<boolean[]>([]);
    const [focusField, setFocusField] = useState<{index: number, type: 'select' | 'quantity'} | null>(null);

    {/* Mostrar moldes disponibles del usuario */}
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
        if (name === 'name' && nameError) {
            setNameError(false);
            setError(null);
        }
        setFormData((prev) => ({...prev, [name]: value}));
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
        // Create new arrays for both error states
        const newSelectErrors = [...moldSelectionErrors];
        const newQuantityErrors = [...moldQuantityErrors];
        const newMolds = [...formData.molds];
    
        if (field === 'uuid') {
            // Handle molde selection
            newSelectErrors[index] = false;
            newMolds[index] = {
                ...newMolds[index],
                uuid: value as string
            };
            setMoldSelectionErrors(newSelectErrors);
            // Only reset focus if we're handling a uuid field
            if (focusField?.type === 'select') {
                setFocusField(null);
            }
        } else {
            // Handle quantity
            const isEmpty = value === '';
            const numValue = isEmpty ? 0 : Number(value);
            const isInvalid = isEmpty || numValue < 1 || isNaN(numValue);
            newQuantityErrors[index] = isInvalid;
            newMolds[index] = {
                ...newMolds[index],
                quantity: numValue
            };
            setMoldQuantityErrors(newQuantityErrors);
            // Only reset focus if we're handling a quantity field
            if (focusField?.type === 'quantity') {
                setFocusField(null);
            }
        }
    
        // Update form data in one go
        setFormData(prev => ({
            ...prev,
            molds: newMolds
        }));
    
        // Clear general error if no validation errors
        if (!newSelectErrors.includes(true) && !newQuantityErrors.includes(true)) {
            setError(null);
        }
    };

    const addMold = () => {
        setFormData((prev) => ({
            ...prev,
            molds: [...prev.molds, {uuid: '', quantity: 1}],
        }));
        setMoldSelectionErrors(prev => [...prev, false]);
        setMoldQuantityErrors(prev => [...prev, false]);
    };
    
    const removeMold = (index: number) => {
        const newMolds = formData.molds.filter((_, i) => i !== index);
        setFormData((prev) => ({...prev, molds: newMolds}));
        setMoldSelectionErrors(prev => prev.filter((_, i) => i !== index));
        setMoldQuantityErrors(prev => prev.filter((_, i) => i !== index));
    };

    const getAvailableMoldesForIndex = (index: number) => {
        const selectedMoldes = formData.molds
            .filter((_, i) => i !== index) // Exclude current index
            .map(m => m.uuid);
        
        return availableMolds.filter(mold => !selectedMoldes.includes(mold.uuid));
    };

    const validateForm = () => {
        // Reset all errors
        setNameError(false);
        setMoldSelectionErrors(new Array(formData.molds.length).fill(false));
        setMoldQuantityErrors(new Array(formData.molds.length).fill(false));
    
        if (formData.name.trim() === '') {
            setError("Por favor, ingrese un nombre para la tizada.");
            setNameError(true);
            setFocusField(null);  // Clear any previous mold focus
            return false;
        }
    
        // Check each mold and set focus on first error
        const newSelectionErrors = new Array(formData.molds.length).fill(false);
        const newQuantityErrors = new Array(formData.molds.length).fill(false);
        let focusSet = false;
    
        for (let i = 0; i < formData.molds.length; i++) {
            const mold = formData.molds[i];
            if (mold.uuid === '') {
                newSelectionErrors[i] = true;
                if (!focusSet) {
                    setFocusField({ index: i, type: 'select' });
                    focusSet = true;
                }
            } else if (mold.quantity < 1) {
                newQuantityErrors[i] = true;
                if (!focusSet) {
                    setFocusField({ index: i, type: 'quantity' });
                    focusSet = true;
                }
            }
        }
    
        if (focusSet) {
            setError("Por favor, complete todos los campos de moldes correctamente.");
            setMoldSelectionErrors(newSelectionErrors);
            setMoldQuantityErrors(newQuantityErrors);
            return false;
        }
    
        return true;
    };

    {/* LLamada a la api */
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsSaveAndOptimize(false);

        //Handle errors
        if (!validateForm()) return;
        
        const maxTime = optimizationTime * 60 * 1000;
        
        // Build the payload
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
        //Handle errors
        if (!validateForm()) return;

        const maxTime = optimizationTime * 60 * 1000;
        let uuid: string | null = null;        

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
                        setError("Error al iniciar la optimización. Verifique su conexión e inténtelo nuevamente.");
                    }
                } catch (error) {
                    console.error('Error starting tizada generation:', error);
                    setError("Error al iniciar la optimización. Verifique su conexión e inténtelo nuevamente.");
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
                            error={nameError}
                            inputRef={input => nameError && input?.focus()}
                            value={formData.name}
                            onChange={handleInputChange}
                            //required
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
                                    <FormControl 
                                        error={moldSelectionErrors[index]}
                                        fullWidth
                                    >
                                        <InputLabel 
                                            error={moldSelectionErrors[index]}
                                        >
                                            Seleccionar Molde
                                        </InputLabel>
                                        <Select
                                            value={mold.uuid}
                                            onChange={(e) => handleMoldChange(index, 'uuid', e.target.value as string)}
                                            label="Seleccionar Molde"
                                            error={moldSelectionErrors[index]}
                                            autoFocus={moldSelectionErrors[index]}
                                            inputRef={input => {
                                                if (focusField?.index === index && 
                                                    focusField.type === 'select') {
                                                    input?.focus();
                                                }
                                            }}
                                        >
                                            {getAvailableMoldesForIndex(index)
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
                                        // Convert 0 to empty string for display, but keep other numbers
                                        value={mold.quantity === 0 ? '' : mold.quantity}
                                        onChange={(e) => handleMoldChange(index, 'quantity', e.target.value)}
                                        InputProps={{
                                            inputProps: { min: 1 }
                                        }}
                                        error={moldQuantityErrors[index]}
                                        inputRef={input => {
                                            if (focusField?.index === index && 
                                                focusField.type === 'quantity') {
                                                input?.focus();
                                            }
                                        }}
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
