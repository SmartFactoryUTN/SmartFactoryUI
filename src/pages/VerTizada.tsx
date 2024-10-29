import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getTizadaById, invokeTizada} from '../api/methods';
import {Tizada} from '../utils/types';
import {formatDate, getStatusDisplay} from '../utils/helpers';
import {useUserContext} from "../components/Login/UserProvider.tsx";

import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {esES} from '@mui/x-data-grid/locales';
import { Button, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';

function VerTizada() {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();
    const [tizada, setTizada] = useState<Tizada | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [svgUrl, setSvgUrl] = useState<string | null>(null);
    const { userData } = useUserContext();

    const fetchTizadaData = async () => {
        try {
            const response = await getTizadaById(uuid!);
            if (response.status === "success") {
                setTizada(response.data);
                if (response.data.state === 'FINISHED' && response.data.results && response.data.results.length > 0) {
                    setSvgUrl(response.data.results[0].url);
                }
            } else {
                console.error("Failed to fetch tizada");
            }
        } catch (error) {
            console.error('Error fetching tizada data:', error);
        }
    };

    useEffect(() => {
        fetchTizadaData();}, [uuid]
    );
  
    const startTizadaProgress = async () => {
        if (!tizada) return;
        try {
            // @ts-expect-error "skipped"
            const response = await invokeTizada(tizada.uuid, userData?.id);
            if (response.status === 'success') {
                setSuccess(true);
                // Wait a brief moment before fetching updated data
                setTimeout(() => {
                    fetchTizadaData();
                    setSuccess(false);
                }, 1000);
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
        { 
            field: 'value', 
            headerName: 'Valor', 
            width: 150,
            renderCell: (params) => {
                if (params.row.property === 'Estado') {
                    return getStatusDisplay(tizada?.state || 'CREATED');
                } else if (params.row.property === 'Fecha de Creación') {
                    return params.value || 'Ninguna';

                } else if (params.row.property === 'Última Actualización') {
                    return params.value || 'Sin cambios';
                } 
                return params.value;
            }
        },
    ];

    const tizadaInfoRows = tizada
        ? [
            { id: 1, property: 'Nombre', value: tizada.name },
            { id: 2, property: 'Estado', value: tizada.state},
            { id: 3, property: 'Fecha de Creación', value: formatDate(tizada.createdAt) },
            { id: 4, property: 'Última Actualización', value: formatDate(tizada.updatedAt)},
            { id: 5, property: 'Total de moldes', value: tizada.parts.reduce((sum, part) => sum + part.quantity, 0).toString() },
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)'}}>
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', width:'100%', padding:'8px 0'}}>
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
                ) :
                tizada?.state === 'IN_PROGRESS' ? (
                    <CircularProgress />
                ) :
                tizada?.state === 'FINISHED' && svgUrl ? (
                    <object
                         type="image/svg+xml"
                         data={svgUrl}
                         style={{
                             width: '100%',
                             height: '100%',
                             margin: '20px',
                             border: '1px solid #ccc',
                             borderRadius: '8px',
                             objectFit: 'contain'
                         }}
                     >
                            Su navegador no soporta SVGs
                        </object>
                ): (
                    <Typography variant="h6" align="center">
                        {tizada?.state === 'ERROR' ? 'Error en la generación de la tizada' :
                        'Estado desconocido'}
                    </Typography>
                )}
            </Box>
            
            {/* Right sidebar with information */}
                <Box sx={{ 
                    width: '350px',
                    borderLeft: '1px solid #e0e0e0',
                    p: 3,
                    overflowY: 'auto',
                    backgroundColor: '#fafafa'
                }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Información de Tizada</Typography>
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
        
      <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Nueva tizada creada!
        </Alert>
      </Snackbar>
    </Box>
    );
};

  
export default VerTizada;
