import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Prenda } from '../utils/types';
import { convertPrenda } from "../api/methods";
import { MainTitle, SectionTitle, SubSectionTitle } from '../components/TitleTypographies';

interface GarmentRowData {
  garment: Prenda;
  quantity: number | null;
  isExpanded: boolean;
  isValid: boolean;
  errorMessage?: string;
}

interface ConvertirPrendaModalProps {
  open: boolean;
  onClose: () => void;
  selectedPrendas: Prenda[];
  onConversionSuccess: () => void;
}

export default function ConvertirPrendaModal({
  open,
  onClose,
  selectedPrendas,
  onConversionSuccess
}: ConvertirPrendaModalProps) {
  const [garmentsData, setGarmentsData] = useState<GarmentRowData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  useEffect(() => {
    if (open && selectedPrendas.length > 0) {
      setGarmentsData(selectedPrendas.map(prenda => ({
        garment: prenda,
        quantity: null,
        isExpanded: false,
        isValid: true
      })));
    }
  }, [open, selectedPrendas]);

  const validateQuantity = (quantity: number | null, garment: Prenda) => {
    if (quantity === null) return { isValid: false, errorMessage: 'Campo requerido' };

    // Check if we have enough molds for this quantity
    for (const piece of garment.fabricPieces) {
      const requiredStock = piece.quantity * quantity;
      if (requiredStock > piece.stock) {
        return { 
          isValid: false, 
          errorMessage: `Stock de moldes insuficiente`
        };
      }
    }

    return { isValid: true };
  };

  const handleQuantityChange = (garmentId: string, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    
    setGarmentsData(current => current.map(data => {
      if (data.garment.garmentId === garmentId) {
        const validation = validateQuantity(numValue, data.garment);
        return {
          ...data,
          quantity: numValue,
          isValid: validation.isValid,
          errorMessage: validation.errorMessage
        };
      }
      return data;
    }));
  };

  const toggleExpand = (garmentId: string) => {
    setGarmentsData(current =>
      current.map(data => ({
        ...data,
        isExpanded: data.garment.garmentId === garmentId ? !data.isExpanded : data.isExpanded
      }))
    );
  };

  const handleConvert = async () => {
    // Validate all fields first
    let isValid = true;
    let firstInvalidId: string | null = null;

    garmentsData.forEach(data => {
      const validation = validateQuantity(data.quantity, data.garment);
      if (!validation.isValid) {
        isValid = false;
        if (!firstInvalidId) firstInvalidId = data.garment.garmentId;
      }
    });

    if (!isValid) {
      setError('Complete los campos para todas las prendas');
      setFocusField(firstInvalidId);
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      for (const data of garmentsData) {
        if (data.quantity === null) continue;

        const response = await convertPrenda({
          garmentId: data.garment.garmentId,
          quantity: data.quantity
        });

        if (response.status !== 'success') {
          throw new Error(response.data.message);
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        onConversionSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al coser las prendas. Intente nuevamente.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <MainTitle>
        {selectedPrendas.length > 1 ? 'Coser prendas' : 'Coser prenda'}
        </MainTitle>
      </DialogTitle>
      

      <DialogContent>

        <SectionTitle>
          {selectedPrendas.length > 1 
            ? 'Prendas seleccionadas para coser' 
            : 'Prenda seleccionada para coser'
          }
        </SectionTitle>
        <Typography color="textSecondary" sx={{mb:2}}>
          {selectedPrendas.length > 1 
            ? 'Indique el stock de prendas a coser para cada una de las prendas seleccionadas. Puede validar la disponibilidad de stock de moldes necesarios desplegando el menú.' 
            : 'Indique el stock de prendas a coser. Puede validar la disponibilidad de stock de moldes necesarios desplegando el menú.' 
          }
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{width:'auto'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Prenda</TableCell>
                <TableCell align="center">Cantidad a coser</TableCell>
                <TableCell align="right">Stock actual</TableCell>
                <TableCell align="right">Stock resultante</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {garmentsData.map((row) => (
                <React.Fragment key={row.garment.garmentId}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(row.garment.garmentId)}
                      >
                        {row.isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.garment.article}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.garment.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={row.quantity === null ? '' : row.quantity}
                        onChange={(e) => handleQuantityChange(row.garment.garmentId, e.target.value)}
                        error={!row.isValid}
                        helperText={row.errorMessage}
                        size="small"
                        autoFocus={focusField === row.garment.garmentId}
                        inputProps={{ min: 1 }}
                        sx={{ width: '100px' }}
                      />
                    </TableCell>
                    <TableCell align="right">{row.garment.stock}</TableCell>
                    <TableCell align="right">
                      {row.quantity === null 
                        ? '-' 
                        : row.garment.stock + row.quantity
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={row.isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <SubSectionTitle>
                            {row.garment.article}
                            </SubSectionTitle>   
                            <Typography color="textSecondary">
                                Moldes necesarios    
                            </Typography>                       
                            <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">Stock actual del molde</TableCell>
                                <TableCell align="right">Stock necesario para coser</TableCell>
                                <TableCell align="right">Stock resultante</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {row.garment.fabricPieces.map((piece) => {
                                const requiredStock = (row.quantity || 0) * piece.quantity;
                                const resultingStock = piece.stock - requiredStock;
                                const isStockInsufficient = resultingStock < 0;

                                return (
                                  <TableRow key={piece.fabricPieceId}>
                                    <TableCell>
                                      <Typography variant="body2">
                                        {piece.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        {piece.molde.description}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Material: {piece.fabricRoll.name}, {piece.fabricRoll.description}, {piece.fabricRoll.color.name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="right">{piece.stock}</TableCell>
                                    <TableCell align="right">{requiredStock || '-'}</TableCell>
                                    <TableCell 
                                      align="right"
                                      sx={{ 
                                        color: isStockInsufficient ? 'error.main' : 'inherit'
                                      }}
                                    >
                                      {row.quantity === null ? '-' : resultingStock}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConvert}
          disabled={isConverting || isSuccess}
          startIcon={isSuccess ? <CheckCircleIcon /> : null}
          sx={{
            backgroundColor: isSuccess ? 'success.main' : 'primary.main',
            '&:hover': { backgroundColor: isSuccess ? 'success.dark' : 'primary.dark' }
          }}
        >
          {isConverting ? "Cosiendo..." : isSuccess ? "Cosido" : "Coser"}
        </Button>
      </DialogActions>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}