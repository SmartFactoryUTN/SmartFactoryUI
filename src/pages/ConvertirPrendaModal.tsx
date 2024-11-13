import React, { useState } from 'react';
import { Box, Button, Modal, Snackbar, Tab, Tabs, TextField, Typography, Tooltip, List, ListItem, ListItemText } from '@mui/material';
import { Prenda } from '../utils/types';
import { convertPrenda } from "../api/methods.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

interface ConvertirPrendaModalProps {
    open: boolean;
    onClose: () => void;
    selectedPrendas: Prenda[];
    onConversionSuccess: () => void;
}

const ConvertirPrendaModal: React.FC<ConvertirPrendaModalProps> = (
    { open, onClose, selectedPrendas, onConversionSuccess }) => {

    const [currentPrendaIndex, setCurrentPrendaIndex] = useState(0);
    const [quantity, setQuantity] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isConverting, setIsConverting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    if (!selectedPrendas || selectedPrendas.length === 0) return null;

    const currentPrenda = selectedPrendas[currentPrendaIndex];
    const stockActualPrendas = currentPrenda.stock || 0;

    const handleConvertir = async () => {
        setIsConverting(true);
        setIsSuccess(false);

        try {
            const response = await convertPrenda({
                "garmentId": currentPrenda.garmentId,
                "quantity": quantity
            });
            if (response.status === 'success') {
                setIsSuccess(true);
                setSuccessMessage("¡Tu stock de prendas aumentó correctamente!");
                setTimeout(() => {
                    setIsSuccess(false);
                    setSuccessMessage("");
                    onConversionSuccess();
                }, 1500);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Error en la conversión. Intenta nuevamente.');
        } finally {
            setIsConverting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);

        setQuantity(value);
        setError(isNaN(parsedValue) || parsedValue <= 0 ? 'Por favor, ingresa un número entero positivo mayor que 0' : '');
    };

    return (
        <Modal 
            open={open} 
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                width: '760px',
                maxHeight: '80vh',
                m: 2,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header Section - Fixed */}
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" align="left">
                        Coser Prenda
                    </Typography>
                    
                    <Tabs
                        value={currentPrendaIndex}
                        onChange={(_, newIndex) => setCurrentPrendaIndex(newIndex)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mt: 2 }}
                    >
                        {selectedPrendas.map((prenda) => (
                            <Tab label={prenda.article} key={prenda.garmentId} />
                        ))}
                    </Tabs>
                </Box>

                {/* Content Section - Scrollable */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        },
                    },
                }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                            Ingresá la cantidad de prendas que quieras coser.
                        </Typography>
                        <Tooltip title="SmartFactory calculará si cuentas con moldes suficientes y te los restará de tu stock.">
                            <InfoIcon color="action" fontSize="small" />
                        </Tooltip>
                    </Box>

                    <TextField
                        fullWidth
                        type="number"
                        value={quantity}
                        onChange={handleInputChange}
                        error={!!error}
                        helperText={error || "Ingresa la cantidad de prendas a coser"}
                        placeholder="Cantidad de prendas"
                        size="small"
                        sx={{ mb: 2 }}
                        InputProps={{
                            inputProps: { min: 1 },
                            sx: { padding: '4px 8px' }
                        }}
                    />
                    <Typography color="textSecondary">
                        Stock actual de esta prenda: {stockActualPrendas}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Moldes que conforman la prenda
                        </Typography>
                        <List>
                            {currentPrenda.fabricPieces && currentPrenda.fabricPieces.map((mold, index) => (
                                <ListItem key={index}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <ListItemText
                                            primary={`${mold.name}`}
                                            secondary={`Stock: ${mold.quantity}`}
                                            sx={{ mb: 0 }}
                                        />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {`Moldes cortados que gastarás: ${mold.quantity * Number(quantity)}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>

                {/* Footer Section - Fixed */}
                <Box sx={{ 
                    p: 3, 
                    borderTop: '1px solid', 
                    borderColor: 'divider',
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    bgcolor: 'background.paper',
                }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>
                        Cerrar
                    </Button>
                    <Button
                        onClick={handleConvertir}
                        variant="contained"
                        startIcon={isSuccess ? <CheckCircleIcon /> : null}
                        color="primary"
                        disabled={!!error || quantity === '' || isConverting || isSuccess}
                        sx={{
                            backgroundColor: isSuccess ? 'green' : 'primary.main',
                            '&:hover': { backgroundColor: isSuccess ? 'darkgreen' : 'primary.dark' }
                        }}
                    >
                        {isConverting ? "Convirtiendo..." : isSuccess ? "Convertida" : "Convertir"}
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