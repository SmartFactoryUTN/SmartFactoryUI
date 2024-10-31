import {
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
import {RolloDeTela, Tizada} from "../utils/types";
import {useEffect, useState} from "react";
import {convertRollos, getTizadas} from "../api/methods.ts"; // getTizadasFinalizadas ver si vuelve
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {useUserContext} from "../components/Login/UserProvider.tsx";

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

const ConvertirRolloModal: React.FC<ConvertirRolloModalProps> = ({open, onClose, selectedRollos, onConversionSuccess}) => {
    //const [tizadasFinished, setTizadasFinished] = useState<Tizada[]>([]);
    const [selectedTizada, setSelectedTizada] = useState<Tizada | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    //const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tizadas, setTizadas] = useState<Tizada[]>([]);
    const { userData } = useUserContext();

    const [convertirRolloData, setConvertirRolloData] = useState<ConvertirRolloModalData>({
        tizadaId: "",
        layerMultiplier: 1,
        rollsQuantity: []
    });

    useEffect(() => {
        setConvertirRolloData({
            ...convertirRolloData,
            rollsQuantity: selectedRollos.map(rollo => ({
                rollId: rollo.fabricRollId,
                quantity: 1
            }))
        });
    }, [selectedRollos]);

    {/*
    useEffect(() => {
        fetchTizadasFinalizadas();
    }, []);    */}
    
    useEffect(() => {
        fetchTizadas();
    }, []);

    useEffect(() => {
        if (!open) {
            resetValues();
        }
    }, [open]);

    {/**/}
    const fetchTizadas = async () => {
        try {
          const response = await getTizadas(userData?.id);
          if (response.status === "success") {
            // @ts-expect-error "skipped"
            const finishedTizadas = response.data["tizadas"].filter(
                (tizada: Tizada) => tizada.state === "FINISHED"
            );
            setTizadas(finishedTizadas);
          } else {
            console.error("Failed to fetch tizadas");
          }
        } catch (error) {
          console.error("Error fetching tizadas:", error);
        }
    };    
    
    {/*
    const fetchTizadasFinalizadas = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await getTizadasFinalizadas();
            if (result.status === 'success') {
                setTizadasFinished(result.data);
            } else {
                console.error('Failed to fetch tizadas:', result.data);
                setError('Failed to fetch tizadas. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching tizadas:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);*/}

    const handleTizadaChange = (event: any) => {
        const selectedId = event.target.value;
        const selected = tizadas.find((tizada) => tizada.uuid === selectedId);
        setSelectedTizada(selected || null);
        setConvertirRolloData({ ...convertirRolloData, tizadaId: selectedId });
    };

    const handleQuantityChange = (rollId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        const updatedRollsQuantity = convertirRolloData.rollsQuantity.map((roll) =>
            roll.rollId === rollId ? { ...roll, quantity: newQuantity } : roll
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
                setIsConverting(false);
                setSuccessMessage("¡Rollos convertidos a moldes exitosamente!");
                setTimeout(() => {
                    setIsSuccess(false);
                    setSuccessMessage("");
                    onClose();
                    onConversionSuccess();
                }, 1500);
            } else {
                console.error('Error al guardar el rollo:', response.data.message);
                setIsConverting(false);
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
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
            })),
        });
        setSelectedTizada(null);
        setSuccessMessage("");
        setError(null);
        setIsSuccess(false);
        setIsConverting(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth sx={{width: '700px', maxWidth: '90%', margin: 'auto'}}>
            <DialogTitle variant={"h5"}>Convertir rollos seleccionados a moldes cortados</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Cantidad de tendidas"
                    fullWidth
                    variant="outlined"
                    value={convertirRolloData.layerMultiplier}
                    onChange={(e) => setConvertirRolloData({ ...convertirRolloData, layerMultiplier: parseInt(e.target.value, 10) })}
                />
                <Select
                    fullWidth
                    value={selectedTizada?.uuid || ""}
                    id={"tizadaSelect"}
                    onChange={handleTizadaChange}
                    variant={"outlined"}
                    displayEmpty
                    sx={{mt: 2}}
                    renderValue={selectedTizada?.uuid ? undefined : () => "Seleccione tizada"}
                >
                    <MenuItem value={""} disabled>
                        Seleccione tizada
                    </MenuItem>
                    {tizadas.map((tizada) => (
                        <MenuItem key={tizada.uuid} value={tizada.uuid}>
                            {tizada.name}
                        </MenuItem>
                    ))}
                </Select>

                <Typography sx={{mt:3, mb:2}} variant={"h6"}>Rollos seleccionados:</Typography>

                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Typography sx={{"fontWeight": "bold"}}>Nombre del rollo</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography sx={{"fontWeight": "bold"}}>Cantidad</Typography>
                    </Grid>
                </Grid>

                {/* Lista de rollos */}
                {convertirRolloData.rollsQuantity.length > 0 && selectedRollos.map((rollo, index) => (
                    <Grid container spacing={2} key={rollo.fabricRollId} sx={{mb: 2}} alignItems="center">
                        <Grid item xs={9}>
                            <Typography>{rollo.name}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                value={convertirRolloData.rollsQuantity[index]?.quantity || 1}
                                onChange={(e) => handleQuantityChange(rollo.fabricRollId, parseInt(e.target.value, 10))}
                                inputProps={{ min: 1 }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                ))}
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                />
                <Snackbar
                    open={!!error}
                    autoHideDuration={3000}
                    onClose={() => setError(null)}
                    message={error}
                />
            </DialogContent>

            <DialogActions sx={{mr: 2, mb: 2}}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={isSuccess ? <CheckCircleIcon /> : null}
                    disabled={isConverting || isSuccess}
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
                >
                    {isConverting ? "Convirtiendo..." : isSuccess ? "Convertidos" : "Convertir"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConvertirRolloModal;
