import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function VerTizada() {
    const navigate = useNavigate();
   
       return (
        <Container sx={{width:'50%', mt:'6%', display:'table'}}>
            <Box sx={{width:'100%', height:'15%', m:'6%'}}>
                <Typography color="black" variant="h4">Tiempo: 5 min, 48 seg</Typography>
                <LinearProgress variant="determinate" value={30} />
            </Box>
            <Box sx={{width:'100%', height:'15%', m:'6%'}}>
                <Typography color="black" variant="h4">% Aprovechamiento: 98%</Typography>
                <LinearProgress variant="determinate" value={98} />
            </Box>
            <Box sx={{width:'100%',height:'70%%', m:'6%'}}>
                <CircularProgress />
            </Box>
        </Container>
       );
   };
   
   export default VerTizada