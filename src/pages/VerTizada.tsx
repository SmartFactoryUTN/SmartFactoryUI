import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTizadaById, invokeTizada } from '../api/methods';
import { Tizada } from '../utils/types';
import { formatDate } from '../utils/helpers';
import { TEST_USER_ID } from '../utils/constants';

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

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
  
    const startTizadaProgress = async () => {
        if (!tizada) return;
        try {
            const response = await invokeTizada(tizada.uuid, TEST_USER_ID);
            if (response.status === "OK") {
                setSuccess(true);
                //fetchTizadaData(); // TODO: Update current page data
            } else {
                setError("Failed to start tizada generation. Please try again.");
            }
        } catch (error) {
            console.error('Error starting tizada generation:', error);
            setError("An error occurred while starting tizada generation. Please try again.");
        }
    };

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
        { field: 'name', headerName: 'Molde', width: 120 },
        //{ 
        //    field: 'area', 
        //    headerName: 'Área', 
        //    width: 80, 
        //    valueFormatter: formatArea 
        //},        
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh', marginTop:2 }}>
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Main content area */}
            <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 2 
            }}>
                {tizada?.state === 'CREATED' ? (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ¿Todo listo para comenzar? Confirme que los datos sean correctos para empezar a generar su tizada.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={startTizadaProgress}
                        >
                            GENERAR TIZADA
                        </Button>
                    </Box>
                ) : (
                    <Typography variant="h6" align="center">
                        {tizada?.state === 'IN_PROGRESS' ? 'Generación en progreso...' :
                        tizada?.state === 'FINISHED' ? 'Tizada generada con éxito' :
                        tizada?.state === 'ERROR' ? 'Error en la generación de la tizada' :
                        'Estado desconocido'}
                    </Typography>
                )}
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
