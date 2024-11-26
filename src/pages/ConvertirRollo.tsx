import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Collapse,
  Box,
  IconButton,
  Alert,
  Snackbar,
  FormHelperText
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RolloDeTela, TizadaResult } from '../utils/types';
import { convertRollos, getTizadas, getTizadaById } from '../api/methods';
import { useUserContext } from '../components/Login/UserProvider';
import { MainTitle, SectionTitle, SubSectionTitle } from '../components/TitleTypographies';

interface ValidationErrors {
  tizada?: string;
  rolls: {
    [key: string]: {
      quantity?: string;
      layerCount?: string;
    };
  };
}

interface MoldResult {
  moldId: string;
  name: string;
  description: string;
  resultingStock: number;
}

interface RollDetailedData {
  rollId: string;
  name: string;
  description: string;
  color: string;
  quantity: number | null;
  layerCount: number | null;
  currentStock: number;
  isExpanded: boolean;
  moldResults: MoldResult[];
}

interface ConvertirRolloModalProps {
  open: boolean;
  onClose: () => void;
  selectedRollos: RolloDeTela[];
  onConversionSuccess: () => void;
}

const ConvertirRolloModal: React.FC<ConvertirRolloModalProps> = ({
  open,
  onClose,
  selectedRollos,
  onConversionSuccess
}) => {
  const { userData } = useUserContext();
  const [tizadas, setTizadas] = useState<TizadaResult[]>([]);
  const [selectedTizada, setSelectedTizada] = useState<TizadaResult | null>(null);
  const [rollsData, setRollsData] = useState<RollDetailedData[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({ rolls: {} });
  const [focusField, setFocusField] = useState<{
    rollId?: string;
    field?: 'quantity' | 'layerCount';
  } | null>(null);

  const resetModal = () => {
    setSelectedTizada(null);
    setRollsData([]);
    setValidationErrors({ rolls: {} });
    setFocusField(null);
    setError(null);
    setSuccess(false);
    setIsConverting(false);
  };

  useEffect(() => {
    if (!open) {
      resetModal();
    }
  }, [open]);

  useEffect(() => {
    const fetchTizadas = async () => {
      try {
        const response = await getTizadas(userData?.id);
        if (response.status === "success") {
          // @ts-ignore
          const finishedTizadas = response.data.tizadas.filter(
            (tizada: TizadaResult) => tizada.state === "FINISHED"
          );
          setTizadas(finishedTizadas);
        }
      } catch (error) {
        setError("Error al cargar tizadas");
      }
    };
    if (open) {
      fetchTizadas();
    }
  }, [userData?.id, open]);

  useEffect(() => {
    if (selectedRollos.length > 0 && open) {
      setRollsData(selectedRollos.map(rollo => ({
        rollId: rollo.fabricRollId,
        name: rollo.name,
        description: rollo.description,
        color: rollo.color.name,
        quantity: 1 as number | null,
        layerCount: 1 as number | null,
        currentStock: rollo.stock,
        isExpanded: false,
        moldResults: []
      })));
    }
  }, [selectedRollos, open]);

  const validateRoll = (roll: RollDetailedData) => {
    const errors: { quantity?: string; layerCount?: string } = {};
    
    if (roll.quantity === null || roll.quantity === 0) {
      errors.quantity = 'Campo requerido';
    } else if (roll.quantity > roll.currentStock) {
      errors.quantity = 'Stock insuficiente';
    } else if (roll.quantity < 0) {
      errors.quantity = 'Debe ser mayor a 0';
    }

    if (roll.layerCount === null || roll.layerCount === 0) {
      errors.layerCount = 'Campo requerido';
    } else if (roll.layerCount < 0) {
      errors.layerCount = 'Debe ser mayor a 0';
    }

    return errors;
  };

  const calculateMoldResultStock = (
    baseParts: number,
    quantity: number | null,
    layerCount: number | null
  ): number => {
    if (quantity === null || layerCount === null) {
      return 0;
    }
    return baseParts * quantity * layerCount;
  };

  const handleTizadaChange = async (event: any) => {
    const selectedId = event.target.value;
    
    try {
      if (!selectedId) {
        setSelectedTizada(null);
        return;
      }

      const response = await getTizadaById(selectedId);
      if (response.status === "success") {
        setSelectedTizada(response.data);
        
        setRollsData(current => {
          const updatedRolls = current.map(roll => ({
            ...roll,
            moldResults: response.data.parts.map(part => ({
              moldId: part.mold.uuid,
              name: part.mold.name,
              description: part.mold.description,
              resultingStock: calculateMoldResultStock(
                part.quantity,
                roll.quantity,
                roll.layerCount
              )
            }))
          }));

          // Revalidar cada rollo
          const newErrors: ValidationErrors = { rolls: {} };
          updatedRolls.forEach(roll => {
            const rollErrors = validateRoll(roll);
            if (Object.keys(rollErrors).length > 0) {
              newErrors.rolls[roll.rollId] = rollErrors;
            }
          });
          setValidationErrors(prev => ({
            ...prev,
            ...newErrors
          }));

          return updatedRolls;
        });
      }
    } catch (error) {
      setError("Error al cargar detalles de la tizada");
    }
  };

  const handleQuantityChange = (rollId: string, value: string) => {
    setRollsData(current => 
      current.map(roll => {
        if (roll.rollId === rollId) {
          const numValue = value === '' ? null : parseInt(value);
          const newRoll = {
            ...roll,
            quantity: numValue,
            moldResults: selectedTizada ? roll.moldResults.map(result => ({
              ...result,
              resultingStock: calculateMoldResultStock(
                selectedTizada.parts.find(p => p.mold.uuid === result.moldId)?.quantity || 0,
                numValue,
                roll.layerCount
              )
            })) : []
          };

          const errors = validateRoll(newRoll);
          setValidationErrors(prev => ({
            ...prev,
            rolls: {
              ...prev.rolls,
              [rollId]: errors
            }
          }));

          return newRoll;
        }
        return roll;
      })
    );
  };

  const handleLayerCountChange = (rollId: string, value: string) => {
    setRollsData(current => 
      current.map(roll => {
        if (roll.rollId === rollId) {
          const numValue = value === '' ? null : parseInt(value);
          const newRoll = {
            ...roll,
            layerCount: numValue,
            moldResults: selectedTizada ? roll.moldResults.map(result => ({
              ...result,
              resultingStock: calculateMoldResultStock(
                selectedTizada.parts.find(p => p.mold.uuid === result.moldId)?.quantity || 0,
                roll.quantity,
                numValue
              )
            })) : []
          };

          const errors = validateRoll(newRoll);
          setValidationErrors(prev => ({
            ...prev,
            rolls: {
              ...prev.rolls,
              [rollId]: errors
            }
          }));

          return newRoll;
        }
        return roll;
      })
    );
  };

  const handleExpand = (rollId: string) => {
    setRollsData(current =>
      current.map(roll => ({
        ...roll,
        isExpanded: roll.rollId === rollId ? !roll.isExpanded : roll.isExpanded
      }))
    );
  };

  const validateForm = () => {
    if (!selectedTizada) {
      setValidationErrors(prev => ({
        ...prev,
        tizada: 'Debe seleccionar una tizada'
      }));
      return false;
    }

    const errors: ValidationErrors = { rolls: {} };
    let hasErrors = false;
    let firstErrorField: {
      rollId?: string;
      field?: 'quantity' | 'layerCount';
    } | null = null;

    rollsData.forEach(roll => {
      const rollErrors = validateRoll(roll);
      if (Object.keys(rollErrors).length > 0) {
        errors.rolls[roll.rollId] = rollErrors;
        hasErrors = true;
        if (!firstErrorField) {
          firstErrorField = {
            rollId: roll.rollId,
            field: Object.keys(rollErrors)[0] as 'quantity' | 'layerCount'
          };
        }
      }
    });

    setValidationErrors(errors);
    if (firstErrorField) {
      setFocusField(firstErrorField);
    }

    return !hasErrors;
  };

  const handleConvert = async () => {
    if (!validateForm()) {
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      for (const roll of rollsData) {
        if (roll.quantity === null || roll.layerCount === null) {
          throw new Error('Valores inválidos');
        }

        const convertData = {
          tizadaId: selectedTizada?.uuid,
          layerMultiplier: roll.layerCount,
          rollsQuantity: [{
            rollId: roll.rollId,
            quantity: roll.quantity
          }]
        };

        const response = await convertRollos(convertData);
        if (response.status !== 'success') {
          throw new Error(`Error converting roll ${roll.name}`);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onConversionSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setError("Error al convertir uno o más rollos");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle><MainTitle>Convertir rollo de tela</MainTitle></DialogTitle>
      <DialogContent>
        <SectionTitle>
          Tizada a utilizar como patrón de corte:
        </SectionTitle>
        
        <FormControl 
          fullWidth 
          margin="normal"
          error={!!validationErrors.tizada}
        >
          <InputLabel>Seleccione tizada</InputLabel>
          <Select
            value={selectedTizada?.uuid || ""}
            onChange={handleTizadaChange}
            label="Seleccione tizada"
          >
            <MenuItem value="">
              <em>Seleccione una tizada</em>
            </MenuItem>
            {tizadas.map((tizada) => (
              <MenuItem key={tizada.uuid} value={tizada.uuid}>
                {tizada.name}
              </MenuItem>
            ))}
          </Select>
          {validationErrors.tizada && (
            <FormHelperText>{validationErrors.tizada}</FormHelperText>
          )}
        </FormControl>
        
        <Box sx={{margin:1}}>
        <SectionTitle>
          {rollsData.length > 1 ? 'Materiales seleccionados:' : 'Material seleccionado:'}
        </SectionTitle>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Rollo de tela</TableCell>
                <TableCell align="center">Stock a cortar</TableCell>
                <TableCell align="center">Tendidas</TableCell>
                <TableCell align="right">Stock restante</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rollsData.map((roll) => (
                <React.Fragment key={roll.rollId}>
                  <TableRow>
                    <TableCell>
                      {selectedTizada && (
                        <IconButton
                          size="small"
                          onClick={() => handleExpand(roll.rollId)}
                        >
                          {roll.isExpanded ? 
                            <KeyboardArrowUpIcon /> : 
                            <KeyboardArrowDownIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <SubSectionTitle>{roll.name}</SubSectionTitle>
                      <Typography variant="body2" color="textSecondary" margin='0'>
                        {roll.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Color: {roll.color}
                      </Typography>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        height: '90px',
                        position: 'relative',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          type="number"
                          value={roll.quantity === null ? '' : roll.quantity}
                          onChange={(e) => handleQuantityChange(roll.rollId, e.target.value)}
                          error={!!validationErrors.rolls[roll.rollId]?.quantity}
                          size="small"
                          autoFocus={focusField?.rollId === roll.rollId && focusField?.field === 'quantity'}
                          sx={{
                            '& .MuiInputBase-root': {
                              backgroundColor: 'background.paper'
                            }
                          }}
                        />
                        {validationErrors.rolls[roll.rollId]?.quantity && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              position: 'absolute',
                              bottom: '-20px',
                              left:0,
                              right: 0,
                              textAlign: 'center'
                            }}
                          >
                            {validationErrors.rolls[roll.rollId]?.quantity}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        height: '90px',
                        position: 'relative',
                        verticalAlign: 'middle'
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          type="number"
                          value={roll.layerCount === null ? '' : roll.layerCount}
                          onChange={(e) => handleLayerCountChange(roll.rollId, e.target.value)}
                          error={!!validationErrors.rolls[roll.rollId]?.layerCount}
                          size="small"
                          autoFocus={focusField?.rollId === roll.rollId && focusField?.field === 'layerCount'}
                          sx={{
                            '& .MuiInputBase-root': {
                              backgroundColor: 'background.paper'
                            }
                          }}
                        />
                        {validationErrors.rolls[roll.rollId]?.layerCount && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{
                              position: 'absolute',
                              bottom: '-20px',
                              left: 0,
                              right: 0,
                              textAlign: 'center'
                            }}
                          >
                            {validationErrors.rolls[roll.rollId]?.layerCount}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={roll.quantity !== null && roll.quantity > roll.currentStock ? 'error' : 'inherit'}>
                        {roll.quantity === null ? '-' : roll.currentStock - roll.quantity}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Stock actual: {roll.currentStock}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={roll.isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <SubSectionTitle>
                            Moldes cortados a obtener
                          </SubSectionTitle>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Molde</TableCell>
                                <TableCell>Material</TableCell>
                                <TableCell align="right">Stock resultante</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {roll.moldResults.map((moldResult) => (
                                <TableRow key={moldResult.moldId}>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {moldResult.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {moldResult.description}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {roll.description}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      Color: {roll.color}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    {moldResult.resultingStock === 0 ? '-' : moldResult.resultingStock}
                                  </TableCell>
                                </TableRow>
                              ))}
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
          disabled={isConverting || success}
          startIcon={success ? <CheckCircleIcon /> : null}
          sx={{
            backgroundColor: success ? 'success.main' : 'primary.main',
            '&:hover': {
              backgroundColor: success ? 'success.dark' : 'primary.dark'
            }
          }}
        >
          {isConverting ? 'Convirtiendo...' : 'Convertir'}
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
};

export default ConvertirRolloModal;