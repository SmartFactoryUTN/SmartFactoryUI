import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTizadaById } from '../api/methods';
import { Tizada } from '../utils/types';
import { formatDate, formatArea } from '../utils/helpers';


import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
  
function VerTizada() {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();
    const [loading, setLoading] = useState(true);
    const [tizada, setTizada] = useState<Tizada | null>(null);
  
    useEffect(() => {
        const fetchTizadaData = async () => {
            setLoading(true);
            try {
                const response = await getTizadaById(uuid!);
                if (response.status === "OK") {
                    setTizada(response.data);
                } else {
                    console.error("Failed to fetch tizada");
                }
            } catch (error) {
                console.error('Error fetching tizada data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTizadaData();
    }, [uuid]);
  
    const tizadaInfoColumns: GridColDef[] = [
        { field: 'property', headerName: 'Propiedad', width: 150 },
        { field: 'value', headerName: 'Valor', width: 150 },
    ];

    const tizadaInfoRows = tizada
        ? [
            { id: 1, property: 'Nombre', value: tizada.name },
            { id: 2, property: 'Estado', value: tizada.state },
            { id: 3, property: 'Fecha de Creación', value: tizada.createdAt, valueFormatter: formatDate, },
            { id: 4, property: 'Última Actualización', value: tizada.updatedAt, valueFormatter: formatDate, },
            { id: 5, property: 'Cantidad Total', value: tizada.parts.reduce((sum, part) => sum + part.quantity, 0).toString() },
        ]: [];

    const moldColumns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre', width: 120 },
        { 
            field: 'area', 
            headerName: 'Área', 
            width: 80, 
            valueFormatter: formatArea 
        },        
        { field: 'description', headerName: 'Descripción', width: 150 },
        { field: 'quantity', headerName: 'Cantidad', width: 80 },
    ];

    const moldRows = tizada?.parts.map((part, index) => ({
        id: index,
        name: part.mold.name,
        area: part.mold.area,
        description: part.mold.description,
        quantity: part.quantity,
    })) || [];
  
    if (loading) {
            return (
                <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>Cargando Tizada...</Typography>
                </Box>
                </Container>
            );
    }

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', flexDirection: 'column'}}>
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Main content area with placeholder SVG */}
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f0f0f0" />
                        <circle cx="250" cy="250" r="200" fill="#ddd" />
                        <text x="250" y="250" fontFamily="Arial" fontSize="24" fill="#666" textAnchor="middle" dominantBaseline="middle">
                            Tizada Placeholder
                        </text>
                    </svg>
                </Box>
                
                {/* Right sidebar with information */}
                <Box sx={{ width: 300, borderLeft: '1px solid #ccc', p: 2, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>Información de Tizada</Typography>
                    <DataGrid
                        rows={tizadaInfoRows}
                        columns={tizadaInfoColumns}
                        hideFooter={true}
                        disableColumnMenu
                        autoHeight
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Moldes</Typography>
                    <DataGrid
                        rows={moldRows}
                        columns={moldColumns}
                        hideFooter={true}
                        disableColumnMenu
                        autoHeight
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    />
                </Box>
            </Box>
            
            {/* Footer with back button */}
            <Box sx={{ p: 2, borderTop: '1px solid #ccc', textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/tizadas')}>
                    Volver a Mis Tizadas
                </Button>
            </Box>
        </Box>
    );
}
  
export default VerTizada;
