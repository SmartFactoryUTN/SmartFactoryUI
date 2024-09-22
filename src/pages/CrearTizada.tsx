import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Height } from '@mui/icons-material';

function MisTizadas() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ancho: '',
        largo: '',
        tiempo: '',
        porcentaje: ''
       });
   
       // Handle input change
       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
           const { name, value } = e.target;
           setFormData({
               ...formData,
               [name]: value
           });
       };
   
       // Handle form submission
       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
   
           try {
               const response = await fetch('http://localhost:8080/api/data', { // 
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(formData)
               });
   
               if (!response.ok) {
                   throw new Error('Network response was not ok');
               }
   
               const result = await response.json();
               console.log('Success:', result);
               navigate('/tizadas/tizada');
           } catch (error) {
               console.error('Error:', error);
               navigate('/tizadas/tizada')
           }
       };
   
       return (
        <Container sx={{width:'50%', mt:'6%'}}>
            <Typography align='left' color="black" variant="h6">Crear Nueva Tizada</Typography>
            <Box 
                component="form" onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}    
            >
                <TextField
                    id="tizada-name"
                    label="Nombre"
                    defaultValue="Tizada {ID}"
                    fullWidth
                    margin="normal" 
                />

                <div>
                <TextField
                    id="standard-helperText"
                    label="Dimensiones de la mesa"
                    defaultValue="2"
                    helperText="Ancho"
                    variant="outlined"
                    sx={{m:0, alignSelf:"left"}}
                />
                <TextField
                    id="standard-helperText"
                    label="(cm)"
                    defaultValue="1"
                    helperText="Alto"
                    variant="outlined"
                />
                </div>
                <ToggleButtonGroup>
                <Tooltip title="Vistazo rápido de tu tizada">
                    <ToggleButton value="rapida">Rápida y sencilla</ToggleButton>
                </Tooltip>
                    <ToggleButton value="android">Estándar</ToggleButton>
                <Tooltip title="Puede tardar un poco más">
                    <ToggleButton value="ios">Máxima Eficiencia</ToggleButton>
                </Tooltip>
                </ToggleButtonGroup>                
                <TextField
                    id="desperdicio"
                    label="% desperdicio"
                    defaultValue="1234"
                    fullWidth
                    margin="normal" 
                />

                


                <Button sx={{width:"25%", alignSelf:"end"}} type="submit" variant="contained">Crear</Button>            
        </Box>
        </Container>
       );
   };
   
   export default MisTizadas