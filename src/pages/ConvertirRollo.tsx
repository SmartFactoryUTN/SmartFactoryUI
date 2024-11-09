import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import { RolloDeTela, TizadaResult } from "../utils/types";
import { useEffect, useState } from "react";
import { convertRollos, getTizadas } from "../api/methods.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useUserContext } from "../components/Login/UserProvider.tsx";

interface ConvertirRolloModalProps {
    open: boolean;
    onClose: () => void;
    selectedRollos: RolloDeTela[];
    onConversionSuccess: () => void;
}

interface ConvertirRolloModalData {
    tizadaId: string;
    layerMultiplier: number;
    rollsQuantity: RollQuantity[];
}

interface RollQuantity {
    rollId: string;
    quantity: number;
}

const ConvertirRolloModal: React.FC<ConvertirRolloModalProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     selectedRollos,
                                                                     onConversionSuccess
                                                                 }) => {
    const [selectedTizada, setSelectedTizada] = useState<TizadaResult | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tizadas, setTizadas] = useState<TizadaResult[]>([]);
    const { userData } = useUserContext();

    const [convertirRolloData, setConvertirRolloData] = useState<ConvertirRolloModalData>({
        tizadaId: "",
        layerMultiplier: 1,
        rollsQuantity: []
    });

    useEffect(() => {
        if (selectedRollos.length > 0) {
            setConvertirRolloData((prevData) => ({
                ...prevData,
                rollsQuantity: selectedRollos.map(rollo => ({
                    rollId: rollo.fabricRollId,
                    quantity: 1
                }))
            }));
        }
    }, [selectedRollos]);

    useEffect(() => {
        fetchTizadas();
    }, []);

    useEffect(() => {
        if (!open) resetValues();
    }, [open]);

    const fetchTizadas = async () => {
        try {
            const response = await getTizadas(userData?.id);
            if (response.status === "success") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const finishedTizadas = response.data["tizadas"].filter(
                    (tizada: TizadaResult) => tizada.state === "FINISHED"
                );
                setTizadas(finishedTizadas);
            } else {
                console.error("Failed to fetch tizadas");
            }
        } catch (error) {
            console.error("Error fetching tizadas:", error);
        }
    };

    const handleTizadaChange = (event: any) => {
        const selectedId = event.target.value;
        const selected = tizadas.find((tizada) => tizada.uuid === selectedId);
        setSelectedTizada(selected || null);
        setConvertirRolloData({ ...convertirRolloData, tizadaId: selectedId });
    };

    const handleQuantityChange = (rollId: string, newQuantity: number) => {
        const updatedRollsQuantity = convertirRolloData.rollsQuantity.map((roll) =>
            roll.rollId === rollId ? { ...roll, quantity: newQuantity || 1 } : roll
        );
        setConvertirRolloData({ ...convertirRolloData, rollsQuantity: updatedRollsQuantity });
    };

    const handleSave = async () => {
        setIsConverting(true);
        setIsSuccess(false);

        try {
            const response = await convertRollos(convertirRolloData);
            if (response.status === 'success') {
                setIsSuccess(true);
                setSuccessMessage("¡Rollos convertidos a moldes exitosamente!");
                setTimeout(() => {
                    onClose();
                    onConversionSuccess();
                    resetValues();
                }, 1500);
            } else {
                setError("No pudimos convertir tus rollos. Por favor, verificar sus stocks.");
            }
        } catch (error) {
            console.error("Error en la conversión:", error);
            setError("Error en la conversión. Intente nuevamente.");
        } finally {
            setIsConverting(false);
        }
    };

    const resetValues = () => {
        setConvertirRolloData({
            tizadaId: "",
            layerMultiplier: 1,
            rollsQuantity: selectedRollos.map(rollo => ({
                rollId: rollo.fabricRollId,
                quantity: 1
            }))
        });
        setSelectedTizada(null);
        setSuccessMessage("");
        setError(null);
        setIsSuccess(false);
        setIsConverting(false);
    };

    const allFieldsCompleted = () => {
        return (
            convertirRolloData.layerMultiplier > 0 &&
            convertirRolloData.tizadaId !== "" &&
            convertirRolloData.rollsQuantity.every((roll) => roll.quantity > 0)
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Convertir rollos seleccionados a moldes cortados</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Cantidad de tendidas"
                    fullWidth
                    variant="outlined"
                    placeholder="1"
                    value={convertirRolloData.layerMultiplier || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setConvertirRolloData({
                            ...convertirRolloData,
                            layerMultiplier: value === "" ? 0 : parseInt(value, 10)
                        });
                    }}
                    onBlur={() => {
                        if (convertirRolloData.layerMultiplier === 0) {
                            setConvertirRolloData({ ...convertirRolloData, layerMultiplier: 1 });
                        }
                    }}
                    inputProps={{ min: 1 }}
                />
                <Select
                    fullWidth
                    value={selectedTizada?.uuid || ""}
                    onChange={handleTizadaChange}
                    displayEmpty
                    sx={{ mt: 2 }}
                >
                    <MenuItem value="" disabled>
                        Seleccione tizada
                    </MenuItem>
                    {tizadas.map((tizada) => (
                        <MenuItem key={tizada.uuid} value={tizada.uuid}>
                            {tizada.name}
                        </MenuItem>
                    ))}
                </Select>
                <Typography sx={{ mt: 3, mb: 2 }} variant="h6">
                    Rollos seleccionados:
                </Typography>
                <Grid container spacing={2} sx={{mb: 4 }}>
                    <Grid item xs={9}>
                        <Typography sx={{ fontWeight: 'bold' }}>Artículo de rollo</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Cantidad</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ pl: 2 }}>
                    {convertirRolloData.rollsQuantity.map((rollo, index) => (
                        <Grid container spacing={2} sx={{mb: 1}} key={rollo.rollId} alignItems="center">
                            <Grid item xs={9}>
                                <Typography>{selectedRollos[index]?.name}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type="number"
                                    placeholder="1"
                                    value={rollo.quantity || ""}
                                    onChange={(e) =>
                                        handleQuantityChange(rollo.rollId, e.target.value === "" ? 0 : parseInt(e.target.value, 10))
                                    }
                                    onBlur={() => {
                                        if (rollo.quantity === 0) {
                                            handleQuantityChange(rollo.rollId, 1);
                                        }
                                    }}
                                    inputProps={{ min: 1 }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                />
                {error && (
                    <Snackbar
                        open={!!error}
                        autoHideDuration={3000}
                        onClose={() => setError(null)}
                        message={error}
                    >
                        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
            </DialogContent>
            <DialogActions sx={{ mr: 2, mb: 2 }}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={isSuccess ? <CheckCircleIcon /> : null}
                    disabled={isConverting || isSuccess || !allFieldsCompleted()}
                    sx={{
                        backgroundColor: isSuccess ? 'green' : 'primary.main',
                        '&:hover': { backgroundColor: isSuccess ? 'darkgreen' : 'primary.dark' },
                        color: 'white'
                    }}
                >
                    {isConverting ? "Convirtiendo..." : isSuccess ? "Convertidos" : "Convertir"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConvertirRolloModal;
