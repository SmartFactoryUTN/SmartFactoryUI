import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar } from '@mui/material';
import { Prenda } from '../utils/types';
import { convertPrenda } from "../api/methods.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ConvertirPrendaModalProps {
    open: boolean;
    onClose: () => void;
    selectedPrenda: Prenda | null;
    onConversionSuccess: () => void;
}

const ConvertirPrendaModal: React.FC<ConvertirPrendaModalProps> = (
    { open, onClose, selectedPrenda, onConversionSuccess }) => {

    const [quantity, setQuantity] = useState<number | string>('');
    const [error, setError] = useState<string>(''); // Estado de error como string
    const [isConverting, setIsConverting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    if (!selectedPrenda) return null;

    const handleConvertir = async () => {
        setIsConverting(true);
        setIsSuccess(false);

        try {
            const response = await convertPrenda({
                "garmentId": selectedPrenda.garmentId,
                "quantity": quantity
            });
            if (response.status === 'success') {
                setIsSuccess(true);
                setIsConverting(false);
                setSuccessMessage("¡Tu stock de prendas aumentó correctamente!");
                setTimeout(() => {
                    setIsSuccess(false);
                    setSuccessMessage("");
                    onClose();
                    onConversionSuccess();
                }, 1500);
            } else {
                console.error('Error al convertir los moldes', response.data.message);
                setError(response.data.message);
                setIsConverting(false);
            }
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
            setError('Error en la conversión. Intenta nuevamente.');
            setIsConverting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue) || parsedValue <= 0) {
            setError('Por favor, ingresa un número entero positivo mayor que 0');
        } else {
            setError('');
        }

        setQuantity(value); // Actualizar el valor del input
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                width: '400px',
                margin: 'auto',
                mt: '20vh'
            }}>
                <Typography variant="h6" component="h2">
                    Convertir Prenda
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Estás a punto de convertir moldes cortados en la prenda: <strong>{selectedPrenda.name}</strong>
                </Typography>
                <Typography sx={{mt: 2}}>
                    Esto restará stock de moldes cortados (si es que hay existencias), considerando los que nos indicaste cuando diste de alta la prenda.
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    ¿En cuánto quisieras aumentar el stock de esta prenda?
                </Typography>
                <TextField
                    fullWidth
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    error={!!error}
                    helperText={error}
                    sx={{ mt: 2 }}
                    InputProps={{ inputProps: { min: 1 } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={onClose} sx={{ mr: 2 }} color="error">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConvertir}
                        variant="contained"
                        startIcon={isSuccess ? <CheckCircleIcon /> : null}
                        color="primary"
                        disabled={!!error || quantity === '' || isConverting || isSuccess}
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
                        {isConverting ? "Convirtiendo..." : isSuccess ? "Convertidas" : "Convertir"}
                    </Button>
                </Box>
                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={3000}
                    message={successMessage}
                    onClose={() => setSuccessMessage("")}
                />
                <Snackbar
                    open={!!error}
                    autoHideDuration={3000}
                    onClose={() => setError('')}
                    message={error}
                />
            </Box>
        </Modal>
    );
};

export default ConvertirPrendaModal;
