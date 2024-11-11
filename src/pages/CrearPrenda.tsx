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
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {Molde, RolloDeTela} from "../utils/types.tsx";
import {createPrenda, getMoldes, getRollos} from "../api/methods.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../components/Login/UserProvider.tsx";

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
    const [_, setError] = useState<string | null>(null); // FIXME: volver a agregar el error
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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

    const handleMoldChange = (index: number, field: 'moldeId' | 'quantity' | 'fabricRollId', value: string | number) => {
        const newMolds = [...prendaFormData.garmentComponents];
        newMolds[index] = { ...newMolds[index], [field]: value };
        setPrendaFormData((prev) => ({ ...prev, garmentComponents: newMolds }));
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

    const handleSave = async () => {
        setIsSaving(true);
        setIsSuccess(false);

        // Validaciones
        if (selectedRollId == '') {
            setError("Por favor, seleccione un rollo de tela");
            setIsSaving(false);
            return;
        }
        if (!prendaFormData.article) {
            setError("Por favor, ingresar el artículo de la prenda");
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
                setIsSaving(false);
                setSuccessMessage("¡Prenda guardada exitosamente!");
                setTimeout(() => {
                    setIsSuccess(false);
                    setSuccessMessage("");
                    navigate(`/inventario`)
                }, 1500);
            } else {
                console.error('Error al guardar la prenda:', response.data.message);
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error creando prenda:', error);
            setError("Un error ocurrió al crear la prenda, intentelo de nuevo por favor.");
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
                <Typography color="black" variant="h4">Agregar una nueva prenda</Typography>
            </Box>
            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography sx={{ flexGrow: 1, textAlign: 'left', mb:2, fontWeight: 'bold' }}> 
                            Artículo de la prenda
                        </Typography>
                        <TextField
                            fullWidth
                            label="Ingrese el artículo de la prenda"
                            name="name"
                            value={prendaFormData.article}
                            onChange={(e) => setPrendaFormData({ ...prendaFormData, article: e.target.value })}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ flexGrow: 1, textAlign: 'left', mb:2, fontWeight: 'bold' }}> 
                            Descripción de la prenda
                        </Typography>
                        <TextField
                            fullWidth
                            label="Ingrese una descripción o detalle de la prenda"
                            value={prendaFormData.description}
                            onChange={(e) => setPrendaFormData({...prendaFormData, description: e.target.value })}
                            rows={3}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ flexGrow: 1, textAlign: 'left', mb:2, fontWeight: 'bold' }}>
                            Material
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Seleccionar un rollo de tela</InputLabel>
                            <Select
                                value={selectedRollId}
                                onChange={(e) => setSelectedRollId(e.target.value)}
                                label="Seleccionar un rollo de tela"
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
                        <Typography sx={{ flexGrow: 1, textAlign: 'left', mb:2, fontWeight: 'bold' }}>
                            Moldes de la prenda
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{mb:2, textAlign: 'left'}}>
                            Seleccione los moldes que componen este artículo e indique la cantidad necesaria de cada uno
                        </Typography>

                        {prendaFormData.garmentComponents.map((mold, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={9}>
                                        <FormControl fullWidth>
                                            <InputLabel>Seleccionar molde</InputLabel>
                                            <Select
                                                value={mold.moldeId}
                                                onChange={(e) => handleMoldChange(index, 'moldeId', e.target.value as string)}
                                                label="Seleccionar molde"
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
                                                {availableMolds.map((availableMold) => (
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
                                            value={mold.quantity}
                                            onChange={(e) => handleMoldChange(index, 'quantity', parseInt(e.target.value))}
                                            InputProps={{ inputProps: { min: 1 } }}
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
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                />
            </form>
        </PageLayout>
    );
}

export default CrearPrenda;
