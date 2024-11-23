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
  Snackbar
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RolloDeTela, TizadaResult } from '../utils/types';
import { convertRollos, getTizadas, getTizadaById } from '../api/methods';
import { useUserContext } from '../components/Login/UserProvider';

interface ConvertirRolloModalProps {
  open: boolean;
  onClose: () => void;
  selectedRollos: RolloDeTela[];
  onConversionSuccess: () => void;
}

interface RollDetailedData {
  rollId: string;
  name: string;
  description: string;
  color: string;
  quantity: number;
  layerCount: number;
  currentStock: number;
  isExpanded: boolean;
  moldResults: {
    moldId: string;
    name: string;
    description: string;
    resultingStock: number;
  }[];
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
    fetchTizadas();
  }, [userData?.id]);

  useEffect(() => {
    if (selectedRollos.length > 0) {
      setRollsData(selectedRollos.map(rollo => ({
        rollId: rollo.fabricRollId,
        name: rollo.name,
        description: rollo.description,
        color: rollo.color.name,
        quantity: 1,
        layerCount: 1,
        currentStock: rollo.stock,
        isExpanded: false,
        moldResults: []
      })));
    }
  }, [selectedRollos]);

  const handleTizadaChange = async (event: any) => {
    const selectedId = event.target.value;
    try {
      const response = await getTizadaById(selectedId);
      if (response.status === "success") {
        setSelectedTizada(response.data);
        // Update moldResults for each roll
        updateMoldResults(response.data);
      }
    } catch (error) {
      setError("Error al cargar detalles de la tizada");
    }
  };

  const updateMoldResults = (tizada: TizadaResult) => {
    setRollsData(currentRolls => 
      currentRolls.map(roll => ({
        ...roll,
        moldResults: tizada.parts.map(part => ({
          moldId: part.mold.uuid,
          name: part.mold.name,
          description: part.mold.description,
          resultingStock: part.quantity * roll.layerCount * roll.quantity
        }))
      }))
    );
  };

  const handleQuantityChange = (rollId: string, value: number) => {
    setRollsData(current => 
      current.map(roll => {
        if (roll.rollId === rollId) {
          return {
            ...roll,
            quantity: value,
            moldResults: roll.moldResults.map(result => ({
              ...result,
              resultingStock: result.resultingStock / roll.quantity * value
            }))
          };
        }
        return roll;
      })
    );
  };

  const handleLayerCountChange = (rollId: string, value: number) => {
    setRollsData(current => 
      current.map(roll => {
        if (roll.rollId === rollId) {
          return {
            ...roll,
            layerCount: value,
            moldResults: roll.moldResults.map(result => ({
              ...result,
              resultingStock: result.resultingStock / roll.layerCount * value
            }))
          };
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

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);

    try {
      for (const roll of rollsData) {
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

  const isValid = () => {
    return selectedTizada && rollsData.every(roll => 
      roll.quantity > 0 && 
      roll.layerCount > 0 && 
      roll.quantity <= roll.currentStock
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Convertir rollos seleccionados a moldes cortados</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Tizada a utilizar como patrón de corte:
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Seleccione tizada</InputLabel>
          <Select
            value={selectedTizada?.uuid || ""}
            onChange={handleTizadaChange}
            label="Seleccione tizada"
          >
            {tizadas.map((tizada) => (
              <MenuItem key={tizada.uuid} value={tizada.uuid}>
                {tizada.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography 
          variant="subtitle1" 
          sx={{ mt: 3, mb: 2 }}
        >
          {rollsData.length > 1 ? 'Materiales seleccionados:' : 'Material seleccionado:'}
        </Typography>

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
                      <Typography variant="subtitle2">{roll.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {roll.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Color: {roll.color}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={roll.quantity}
                        onChange={(e) => handleQuantityChange(
                          roll.rollId, 
                          Math.max(1, parseInt(e.target.value) || 0)
                        )}
                        inputProps={{ min: 1, max: roll.currentStock }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={roll.layerCount}
                        onChange={(e) => handleLayerCountChange(
                          roll.rollId,
                          Math.max(1, parseInt(e.target.value) || 0)
                        )}
                        inputProps={{ min: 1 }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        {roll.currentStock - roll.quantity}
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
                          <Typography variant="h6" gutterBottom component="div">
                            Moldes cortados a obtener
                          </Typography>
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
                                    {moldResult.resultingStock}
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
          disabled={!isValid() || isConverting}
          startIcon={success ? <CheckCircleIcon /> : null}
          sx={{
            backgroundColor: success ? 'success.main' : 'primary.main',
          }}
        >
          {isConverting ? 'Convirtiendo...' : success ? 'Convertido' : 'Convertir'}
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