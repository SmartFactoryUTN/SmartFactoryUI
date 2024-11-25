import PageLayout from "../components/layout/PageLayout.tsx";
import {
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
    Typography,
    Alert
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {Molde, RolloDeTela} from "../utils/types.tsx";
import {createPrenda, getMoldes, getRollos} from "../api/methods.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../components/Login/UserProvider.tsx";
import { MainTitle, SubSectionTitle } from '../components/TitleTypographies';

interface PrendaFormData {
    article: string;
    description: string;
    garmentComponents: GarmentComponent[];
}

interface GarmentComponent {
    moldeId: string;
    quantity: number;
}

function CrearPrenda() {
    const navigate = useNavigate();
    const { userData } = useUserContext();
    const [selectedRollId, setSelectedRollId] = useState<string>('');
    const [prendaFormData, setPrendaFormData] = useState<PrendaFormData>({
        article: "",
        description: "",
        garmentComponents: [{
            moldeId: '',
            quantity: 1,
        }]
    });

    const [availableMolds, setAvailableMolds] = useState<Molde[]>([]);
    const [fabricRolls, setFabricRolls] = useState<RolloDeTela[]>([]);
    const [isLoadingMoldes, setIsLoadingMoldes] = useState<boolean>(false);
    const [isLoadingColors, setIsLoadingColors] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [moldSelectionErrors, setMoldSelectionErrors] = useState<boolean[]>([]);
    const [moldQuantityErrors, setMoldQuantityErrors] = useState<boolean[]>([]);
    const [articleError, setArticleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [rollError, setRollError] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focusField, setFocusField] = useState<{
        type: 'article' | 'description' | 'roll' | 'select' | 'quantity';
        index?: number;
    } | null>(null);

    useEffect(() => {
        fetchMolds();
        fetchColors();
    }, []);

    const fetchMolds = useCallback(async () => {
        if (isLoadingMoldes) return; // Prevent multiple simultaneous calls
        setIsLoadingMoldes(true);
        try {  
            // @ts-expect-error "skipped"
            const result = await getMoldes(userData?.id); // fix anotation: "implicitly type any"
            if (result.status === 'success') {
                console.log(result.data);
                // @ts-expect-error "skipped"
                setAvailableMolds(result.data["moldes"]); // fix anotation: "implicitly type any"
            } else {
                console.error('Failed to fetch molds');
                setError('Failed to fetch molds. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching molds:', error);
            setError('An error occurred while fetching molds. Please try again.');
        } finally {
            setIsLoadingMoldes(false);
        }
    }, [isLoadingMoldes]);

    const fetchColors = useCallback(async () => {
        if (isLoadingColors) return;
        setIsLoadingColors(true);
        try {
            const result = await getRollos();
            if (result.status === 'success') {
                setFabricRolls(result.data);
            } else {
                console.error('Failed to fetch colors:', result.data);
                setError('Failed to fetch colors. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setIsLoadingColors(false);
        }
    }, [isLoadingColors]);

    const getAvailableMoldesForIndex = (index: number) => {
        const selectedMoldes = prendaFormData.garmentComponents 
            .filter((_, i) => i !== index)
            .map(m => m.moldeId);
        
        return availableMolds.filter(mold => !selectedMoldes.includes(mold.uuid));
    };

    const handleMoldChange = (index: number, field: 'moldeId' | 'quantity', value: string | number) => {
        const newSelectErrors = [...moldSelectionErrors];
        const newQuantityErrors = [...moldQuantityErrors];
        const newComponents = [...prendaFormData.garmentComponents];
    
        if (field === 'moldeId') {
            newSelectErrors[index] = false;
            newComponents[index] = {
                ...newComponents[index],
                moldeId: value as string
            };
            setMoldSelectionErrors(newSelectErrors);
            if (focusField?.type === 'select') {
                setFocusField(null);
            }
        } else {
            const isEmpty = value === '';
            const numValue = isEmpty ? 0 : Number(value);
            const isInvalid = isEmpty || numValue < 1 || isNaN(numValue);
            newQuantityErrors[index] = isInvalid;
            newComponents[index] = {
                ...newComponents[index],
                quantity: numValue
            };
            setMoldQuantityErrors(newQuantityErrors);
            if (focusField?.type === 'quantity') {
                setFocusField(null);
            }
        }
    
        setPrendaFormData(prev => ({
            ...prev,
            garmentComponents: newComponents
        }));
    
        if (!newSelectErrors.includes(true) && !newQuantityErrors.includes(true)) {
            setError(null);
        }
    };

    const addMold = () => {
        setPrendaFormData((prev) => ({
            ...prev,
            garmentComponents: [...prev.garmentComponents, { moldeId: '', quantity: 1, fabricRollId: '' }],
        }));
    };

    const removeMold = (index: number) => {
        const newMolds = prendaFormData.garmentComponents.filter((_, i) => i !== index);
        setPrendaFormData((prev) => ({ ...prev, garmentComponents: newMolds }));
    };
    
    const validateForm = () => {
        // Reset all errors
        setArticleError(false);
        setDescriptionError(false);
        setRollError(false);
        setMoldSelectionErrors(new Array(prendaFormData.garmentComponents.length).fill(false));
        setMoldQuantityErrors(new Array(prendaFormData.garmentComponents.length).fill(false));
        
        let isValid = true;
        
        // Validate article
        if (!prendaFormData.article.trim()) {
            setArticleError(true);
            setError("Por favor, ingrese el artículo de la prenda");
            setFocusField({ type: 'article' });
            isValid = false;
            return false;
        }

        // Validate description
        if (!prendaFormData.description.trim()) {
            setDescriptionError(true);
            setError("Por favor, ingrese una descripción de la prenda");
            setFocusField({ type: 'description' });
            isValid = false;
            return false;
        }

        // Validate roll selection
        if (!selectedRollId) {
            setRollError(true);
            setError("Por favor, seleccione un rollo de tela");
            setFocusField({ type: 'roll' });
            isValid = false;
            return false;
        }

        // Check each mold and set focus on first error
        const newSelectionErrors = new Array(prendaFormData.garmentComponents.length).fill(false);
        const newQuantityErrors = new Array(prendaFormData.garmentComponents.length).fill(false);
        let focusSet = false;

        for (let i = 0; i < prendaFormData.garmentComponents.length; i++) {
            const component = prendaFormData.garmentComponents[i];
            if (!component.moldeId) {
                newSelectionErrors[i] = true;
                if (!focusSet) {
                    setFocusField({ type: 'select', index: i });
                    setError("Por favor, seleccione un molde");
                    focusSet = true;
                }
                isValid = false;
            } else if (component.quantity < 1) {
                newQuantityErrors[i] = true;
                if (!focusSet) {
                    setFocusField({ type: 'quantity', index: i });
                    setError("Por favor, ingrese una cantidad válida");
                    focusSet = true;
                }
                isValid = false;
            }
        }

        if (!isValid) {
            setMoldSelectionErrors(newSelectionErrors);
            setMoldQuantityErrors(newQuantityErrors);
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        setIsSaving(true);
        setIsSuccess(false);

        if (!validateForm()) {
            setIsSaving(false);
            return;
        }

        try {
            const payloadToSend = {
                article: prendaFormData.article,
                description: prendaFormData.description,
                garmentComponents: prendaFormData.garmentComponents.map(component => ({
                    ...component,
                    fabricRollId: selectedRollId
                }))
            };
            const response = await createPrenda(payloadToSend);

            if (response.status === "success") {
                setIsSuccess(true);
                setSuccessMessage("¡Prenda guardada exitosamente!");
                setTimeout(() => {
                    setIsSuccess(false);
                    setSuccessMessage("");
                    navigate(`/inventario`)
                }, 1500);
            } else {
                setError("Error al guardar la prenda. Por favor, intentelo nuevamente.");
            }
        } catch (error) {
            console.error('Error creando prenda:', error);
            setError("Un error ocurrió al crear la prenda, intentelo de nuevo por favor.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        // Lógica para volver
        navigate(`/inventario`)
    };

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <MainTitle>Agregar una nueva prenda</MainTitle>
            </Box>
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <SubSectionTitle> 
                            Artículo de la prenda
                        </SubSectionTitle>
                        <TextField
                            fullWidth
                            label="Ingrese el artículo de la prenda"
                            name="name"
                            value={prendaFormData.article}
                            onChange={(e) => {
                                setPrendaFormData({ ...prendaFormData, article: e.target.value });
                                if (articleError) {
                                    setArticleError(false);
                                    setError(null);
                                }
                            }}
                            error={articleError}
                            inputRef={input => {
                                if (focusField?.type === 'article') {
                                    input?.focus();
                                }
                            }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <SubSectionTitle>
                            Descripción de la prenda
                    </SubSectionTitle>
                        <TextField
                            fullWidth
                            label="Ingrese una descripción o detalle de la prenda"
                            value={prendaFormData.description}
                            onChange={(e) => {
                                setPrendaFormData({...prendaFormData, description: e.target.value });
                                if (descriptionError) {
                                    setDescriptionError(false);
                                    setError(null);
                                }
                            }}
                            error={descriptionError}
                            inputRef={input => {
                                if (focusField?.type === 'description') {
                                    input?.focus();
                                }
                            }}
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SubSectionTitle>
                            Material
                        </SubSectionTitle>
                        <FormControl fullWidth error={rollError}>
                            <InputLabel error={rollError}>Seleccionar un rollo de tela</InputLabel>
                            <Select
                                value={selectedRollId}
                                onChange={(e) => {
                                    setSelectedRollId(e.target.value);
                                    if (rollError) {
                                        setRollError(false);
                                        setError(null);
                                    }
                                }}
                                label="Seleccionar un rollo de tela"
                                error={rollError}
                                inputRef={input => {
                                    if (focusField?.type === 'roll') {
                                        input?.focus();
                                    }
                                }}
                                renderValue={(selected) => {
                                    const selectedRoll = fabricRolls.find(roll => roll.fabricRollId === selected);
                                    return selectedRoll ? selectedRoll.name : '';
                                }}
                                sx={{
                                    // Alinea el texto del valor seleccionado
                                    "& .MuiSelect-select": {
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center'
                                    }
                                }}
                            >
                                {fabricRolls.map((roll) => (
                                    <MenuItem key={roll.fabricRollId} value={roll.fabricRollId}>
                                        <Box>
                                            <Typography>{roll.name}</Typography>
                                            <Typography variant="caption" color="textSecondary">
                                            {roll.description} | Color: {roll.color.name}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                            {selectedRollId && (
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={{ mt: 1, ml: 1, textAlign: 'left' }}
                            >
                                {(() => {
                                    const selectedRoll = fabricRolls.find(roll => roll.fabricRollId === selectedRollId);
                                    return selectedRoll ? 
                                        `${selectedRoll.description || 'Sin descripción'} | Color: ${selectedRoll.color.name}` : '';
                                })()}
                            </Typography>
                             )}
                        
                    </Grid>
                    <Grid item xs={12}>
                    <SubSectionTitle>
                    Moldes de la prenda
                    </SubSectionTitle>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{mb:2, textAlign: 'left'}}>
                    Seleccione los moldes que componen este artículo e indique la cantidad necesaria de cada uno
                    </Typography>

                    {prendaFormData.garmentComponents.map((mold, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                        <Grid item xs={9}>
                            <FormControl 
                            fullWidth
                            error={moldSelectionErrors[index]}
                            >
                            <InputLabel error={moldSelectionErrors[index]}>
                                Seleccionar molde
                            </InputLabel>
                            <Select
                                value={mold.moldeId}
                                onChange={(e) => handleMoldChange(index, 'moldeId', e.target.value as string)}
                                label="Seleccionar molde"
                                error={moldSelectionErrors[index]}
                                autoFocus={moldSelectionErrors[index]}
                                inputRef={input => {
                                if (focusField?.index === index && 
                                    focusField.type === 'select') {
                                    input?.focus();
                                }
                                }}
                                renderValue={(selected) => {
                                const selectedMold = availableMolds.find(m => m.uuid === selected);
                                return selectedMold ? (
                                    <Box>
                                    <Typography component="span">{selectedMold.name}</Typography>
                                    <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                                        {selectedMold.description || 'Sin descripción'}
                                    </Typography>
                                    </Box>
                                ) : '';
                                }}
                                sx={{
                                "& .MuiSelect-select": {
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }
                                }}
                            >
                                {getAvailableMoldesForIndex(index)
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((availableMold) => (
                                    <MenuItem key={availableMold.uuid} value={availableMold.uuid}>
                                    <Box>
                                        <Typography>{availableMold.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                        {availableMold.description || 'Sin descripción'}
                                        </Typography>
                                    </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                            fullWidth
                            label="Cantidad"
                            type="number"
                            value={mold.quantity === 0 ? '' : mold.quantity}
                            onChange={(e) => handleMoldChange(index, 'quantity', parseInt(e.target.value))}
                            InputProps={{ inputProps: { min: 1 } }}
                            error={moldQuantityErrors[index]}
                            inputRef={input => {
                                if (focusField?.index === index && 
                                    focusField.type === 'quantity') {
                                input?.focus();
                                }
                            }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton 
                            onClick={() => removeMold(index)} 
                            color="error"
                            aria-label="Eliminar molde"
                            >
                            <DeleteIcon />
                            </IconButton>
                        </Grid>
                        </Grid>
                    </Box>
                    ))}

                    <Box sx={{ mt: 2 }}>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={addMold}
                        variant="outlined"
                    >
                        Agregar otro molde
                    </Button>
                    </Box>
                </Grid>
                </Grid>
                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        onClick={handleBack}
                        color="primary"
                    >
                        Volver
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            backgroundColor: isSuccess ? 'green' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isSuccess ? 'darkgreen' : 'primary.dark',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: isSuccess ? 'green' : 'grey',
                                color: 'white',
                            },
                        }}
                        disabled={isSaving || isSuccess}
                        startIcon={isSuccess ? <CheckCircleIcon /> : null}
                    >
                        {isSaving ? "Guardando..." : isSuccess ? "Guardado" : "Guardar"}
                    </Button>
                </Box>
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert onClose={() => setError(null)} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                />                
            </form>
        </PageLayout>
    );
}

export default CrearPrenda;
