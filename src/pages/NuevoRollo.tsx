import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    createFilterOptions, Typography, CircularProgress, Slide
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { createColor, createRollo, getFabricColors } from "../api/methods.ts";
import { FabricColor } from "../utils/types.tsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

interface NuevoRolloModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
}

const NuevoRolloModal = ({ open, onClose, onSave }: NuevoRolloModalProps) => {
    const [colors, setColors] = useState<FabricColor[]>([]);
    const [selectedColor, setSelectedColor] = useState<FabricColor | null>(null);
    const [newColorName, setNewColorName] = useState("");
    const [rolloName, setRolloName] = useState("");
    const [rolloDescription, setRolloDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [iconType, setIconType] = useState("add");
    const [isColorValid, setIsColorValid] = useState(false);
    const [showRolloSuccessSnackbar, setShowRolloSuccessSnackbar] = useState(false);
    const [lastSavedColor, setLastSavedColor] = useState<FabricColor | null>(null);

    // Habilita GUARDAR si hay un color seleccionado o guardado, y los otros campos están completos.
    const isFormValid = useMemo(() => rolloName.trim() && rolloDescription.trim() && isColorValid, [rolloName, rolloDescription, isColorValid]);
    console.log("IS FORM VALID:", isFormValid);
    console.log("isColorValid:", isColorValid);

    const handleAddColor = async () => {
        if (newColorName.trim()) {
            if (colors.some(color => color.name.toLowerCase() === newColorName.toLowerCase())) {
                setError("El color ya existe");
                return;
            }

            const newColor = { name: newColorName.trim() };

            try {
                const result = await createColor(newColor);
                const persistedNewColor = result.data;

                setIconType("check");
                setIsColorValid(true);
                setLastSavedColor(persistedNewColor);
                setShowSuccessSnackbar(true);

                setTimeout(() => {
                    setColors((prevColors) => [...prevColors, persistedNewColor]);
                    setSelectedColor(persistedNewColor);
                    setNewColorName("");
                    setShowSuccessSnackbar(false);
                    setIconType("add");
                }, 1500);
            } catch (error) {
                setError("Hubo un error al agregar el color. Intente nuevamente.");
                setIconType("error");

                setTimeout(() => setIconType("add"), 3000);
            }
        }
    };

    const handleColorChange = (ev: React.SyntheticEvent, newValue: FabricColor | string | null) => {
        if (newValue === null) {
            // Maneja el caso cuando el valor es limpiado (clear)
            setSelectedColor(null);
            setNewColorName("");
            setIsColorValid(false);
        } else if (typeof newValue === 'string') {
            setNewColorName(newValue);
            setSelectedColor(null);
            setIsColorValid(false);
        } else {
            setNewColorName("");
            setSelectedColor(newValue);
            setIsColorValid(true);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    useEffect(() => {
        if (!open) {
            resetValues();
        }
    }, [open]);

    const fetchColors = useCallback(async () => {
        try {
            const result = await getFabricColors();
            if (result.status === 'success') {
                setColors(result.data);
            } else {
                setError('Failed to fetch colors. Please try again.');
            }
        } catch (error) {
            setError('Error fetching colors');
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setIsSuccess(false);

        if (!isFormValid) {
            alert("Por favor, complete todos los campos.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await createRollo({
                name: rolloName,
                description: rolloDescription,
                fabricColorId: selectedColor ? selectedColor.fabricColorId : ""
            });

            if (response.status === 'success') {
                setIsSuccess(true);
                setShowRolloSuccessSnackbar(true);
                onSave();
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                }, 3000);
            } else {
                setError('Error al guardar el rollo');
            }
        } catch (error) {
            setError('Error en la llamada a la API');
        } finally {
            setIsSaving(false);
        }
    };

    const resetValues = () => {
        setRolloName("");
        setRolloDescription("");
        setSelectedColor(null);
        setNewColorName("");
        setIconType("add");
        setIsColorValid(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth sx={{ width: '600px', maxWidth: '90%', margin: 'auto' }}>
            <DialogTitle>Nuevo Rollo</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Artículo de rollo"
                        fullWidth
                        variant="outlined"
                        value={rolloName}
                        onChange={(e) => setRolloName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={rolloDescription}
                        onChange={(e) => setRolloDescription(e.target.value)}
                    />
                    <Autocomplete
                        options={colors}
                        filterOptions={createFilterOptions({ limit: 5 })}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                        value={selectedColor}
                        onChange={handleColorChange}
                        freeSolo
                        inputValue={newColorName}
                        onInputChange={(_: React.SyntheticEvent, newInputValue: string) => {
                            setNewColorName(newInputValue);
                            console.log("LAST SAVED COLOR: ", lastSavedColor)
                            if (newInputValue != lastSavedColor?.name && lastSavedColor !== null) {
                                console.log("LAST SAVED COLOR nameeee: ", lastSavedColor?.name);
                                console.log("IF DEL AUTOCOMPLETE")
                                setIsColorValid(false);
                            }
                        }}
                        sx={{
                            "& .MuiInputBase-root": {
                                borderColor: newColorName && !colors.some(color => color.name === newColorName) ? "primary.main" : "inherit"
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccione o agregue color"
                                variant="outlined"
                                sx={{ mt: 2 }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {params.InputProps.endAdornment}
                                            {newColorName && !colors.some(color => color.name === newColorName) && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleAddColor}
                                                        edge="end"
                                                        sx={{
                                                            transition: "transform 0.3s ease, opacity 0.3s ease",
                                                            transform: iconType === "check" ? "scale(1.2)" : "scale(1)",
                                                            opacity: iconType === "add" ? 1 : 0.8,
                                                        }}
                                                    >
                                                        {iconType === "check" ? (
                                                            <CheckCircleIcon color="success" />
                                                        ) : iconType === "error" ? (
                                                            <CancelIcon color="error" />
                                                        ) : (
                                                            <AddIcon />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            )}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
                        Selecciona un color existente o ingresa uno nuevo para añadirlo.
                    </Typography>
                </FormControl>
                <Snackbar
                    open={showSuccessSnackbar}
                    autoHideDuration={1500}
                    onClose={() => setShowSuccessSnackbar(false)}
                    TransitionComponent={(props) => <Slide {...props} direction="up" />}
                >
                    <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Color agregado exitosamente
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!error}
                    autoHideDuration={3000}
                    onClose={() => setError(null)}
                    TransitionComponent={(props) => <Slide {...props} direction="up" />}
                >
                    <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={showRolloSuccessSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setShowRolloSuccessSnackbar(false)}
                    TransitionComponent={(props) => <Slide {...props} direction="up" />}
                >
                    <Alert onClose={() => setShowRolloSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        ¡Rollo creado exitosamente!
                    </Alert>
                </Snackbar>
            </DialogContent>
            <DialogActions sx={{ mr: 2, mb: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : isSuccess ? <CheckCircleIcon /> : null}
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving || !isFormValid}
                    sx={{
                        backgroundColor: isSaving ? 'grey' : isSuccess ? 'green' : 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: isSaving ? 'grey' : isSuccess ? 'darkgreen' : 'primary.dark'
                        },
                        '&.Mui-disabled': {
                            backgroundColor: isSuccess ? 'green' : 'grey',
                            color: 'white',
                        },
                    }}
                >
                    {isSaving ? "Guardando..." : isSuccess ? "Guardado" : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NuevoRolloModal;
