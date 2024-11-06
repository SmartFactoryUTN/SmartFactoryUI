import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from "@mui/material";
import {createColor, createRollo, getFabricColors} from "../api/methods.ts"; // Importa la función para crear rollo
import {FabricColor} from "../utils/types.tsx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const NuevoRolloModal = ({open, onClose, onSave}) => {
    const [colors, setColors] = useState<FabricColor[]>([]);
    const [selectedColor, setSelectedColor] = useState<FabricColor | null>(null);
    const [newColorName, setNewColorName] = useState("");
    const [rolloName, setRolloName] = useState("");
    const [rolloDescription, setRolloDescription] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (event: any) => {
        const selectedId = event.target.value;
        const selected = colors.find((color) => color.fabricColorId === selectedId);
        setSelectedColor(selected || null);
    }

    const handleAddColor = async () => {
        if (newColorName.trim()) {
            const newColor = {
                name: newColorName.trim()
            };

            console.log(newColor);

            try {
                const result = await createColor(newColor);
                const persistedNewColor = result.data
                console.log(persistedNewColor);

                setColors((prevColors) => [...prevColors, persistedNewColor]);
                setNewColorName("");
                setSelectedColor(persistedNewColor);
            } catch (error) {
                console.log("Error al agregar el color:", error);
            }
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setError] = useState<string | null>(null); // FIXME: volver a agregar el error

    const fetchColors = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await getFabricColors();
            if (result.status === 'success') {
                setColors(result.data);
            } else {
                console.error('Failed to fetch colors:', result.data);
                setError('Failed to fetch colors. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleSave = async () => {
        setIsSaving(true);
        if (!rolloName || !selectedColor || !rolloDescription) {
            // FIXME: mensajitos lindos en vez de alert todo feo
            alert("Por favor, complete todos los campos.");
            setIsSaving(false);
            return;
        }

        try {
            const response = await createRollo({
                name: rolloName,
                description: rolloDescription,
                fabricColorId: selectedColor.fabricColorId
            });

            if (response.status === 'success') {
                setSuccessMessage("¡Rollo guardado exitosamente!");
                onSave();
                setTimeout(() => {
                    setSuccessMessage("");
                    onClose();
                }, 3000);
            } else {
                console.error('Error al guardar el rollo:', response.data.message);
                setIsSaving(false);
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth sx={{width: '600px', maxWidth: '90%', margin: 'auto'}}>
            <DialogTitle>Nuevo Rollo</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Artículo"
                        fullWidth
                        variant="outlined"
                        value={rolloName}
                        onChange={(e) => setRolloName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        variant="outlined"
                        value={rolloDescription}
                        onChange={(e) => setRolloDescription(e.target.value)}
                    />
                    <Select
                        fullWidth
                        value={selectedColor?.fabricColorId || ""}
                        id={"colorSelect"}
                        onChange={handleChange}
                        variant={"outlined"}
                        displayEmpty
                        sx={{mt: 2}}
                        renderValue={
                            selectedColor?.fabricColorId ? undefined : () => "Seleccione color"
                        }>
                        <MenuItem value={""} disabled>
                            Seleccione color
                        </MenuItem>
                        {colors.map((color) => (
                            <MenuItem key={color.fabricColorId} value={color.fabricColorId}>
                                {color.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        margin="dense"
                        label="Agregar nuevo color"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                    <Button
                        onClick={handleAddColor}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Agregar Color
                    </Button>
                </FormControl>
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Guardando..." : "Guardar"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NuevoRolloModal;
