import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTizadaById, invokeTizada, downloadTizadaSvg } from '../api/methods';
import { TizadaResult } from '../utils/types';
import { formatDate, getStatusDisplay } from '../utils/helpers';
import { useUserContext } from "../components/Login/UserProvider.tsx";
import TizadaDisplay from '../components/TizadaDisplay.tsx';
import TizadaInfoSidebar from '../components/TizadaInfoSidebar.tsx';
import { GridColDef } from '@mui/x-data-grid';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import { useSidebarWidth } from '../components/hooks/useSidebarWidth';

function VerTizada() {
    const navigate = useNavigate();
    const { uuid } = useParams<{ uuid: string }>();
    const [tizada, setTizada] = useState<TizadaResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [svgUrl, setSvgUrl] = useState<string | null>(null);
    const { userData } = useUserContext();
    const sidebarState = useSidebarWidth();

     // Prevent browser zoom
     const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, [handleKeyDown, handleWheel]);
    
    const fetchTizadaData = async () => {
        try {
            const response = await getTizadaById(uuid!);
            if (response.status === "success") {
                setTizada(response.data);
                console.log(response.data);
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
        fetchTizadaData();
    }, [uuid]);
  
    const startTizadaProgress = async () => {
        if (!tizada) return;
        try {
            const response = await invokeTizada(tizada.uuid, userData?.id ?? '');
            if (response.status === 'success') {
                setSuccess(true);
                setTimeout(() => {
                    fetchTizadaData();
                }, 1000);
            } else {
                setError("Failed to start tizada generation. Please try again.");
            }
        } catch (error) {
            console.error('Error starting tizada generation:', error);
            setError("An error occurred while starting tizada generation. Please try again.");
        }
    };

    const handleDownload = useCallback(async () => {
        if (!svgUrl || !tizada) return;
        
        try {
            await downloadTizadaSvg(svgUrl, tizada.name || 'tizada');
        } catch (error) {
            setError("Error al descargar la tizada. Por favor intente nuevamente.");
        }
    }, [svgUrl, tizada]);

    const canDownload = Boolean(tizada?.state === 'FINISHED' && svgUrl);

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
            { id: 3, property: 'Dimensiones (Ancho x Alto)', 
                value: tizada.bin ? `${tizada.bin.width} cm × ${tizada.bin.height} cm`
                : 'No especificadas' },
            { id: 4, property: 'Fecha de Creación', value: formatDate(tizada.createdAt) },
            { id: 5, property: 'Última Actualización', value: formatDate(tizada.updatedAt)},
            { id: 6, property: 'Total de moldes', value: tizada.parts.reduce((sum, part) => sum + part.quantity, 0).toString() },
        ] : [];

    const moldColumns: GridColDef[] = [
        { field: 'name', headerName: 'Molde', width: 250 },
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
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(100vh - 100px)', 
            touchAction: 'none',
            position: 'relative', // Add this
        }}>
            <Box sx={{ 
                position: 'relative', // Add this
                display: 'flex', 
                flex: 1, 
                overflow: 'hidden',
                width: `calc(100% - ${sidebarState.effectiveWidth}px)`, // Change this
                padding: '8px 0',
                transition: 'width 0.2s' // Optional: smooth width transition
            }}>
                <TizadaDisplay 
                    tizada={tizada}
                    svgUrl={svgUrl}
                    onStartProgress={startTizadaProgress}
                />
                
                <TizadaInfoSidebar 
                    tizadaInfoRows={tizadaInfoRows}
                    tizadaInfoColumns={tizadaInfoColumns}
                    moldRows={moldRows}
                    moldColumns={moldColumns}
                    onDownload={handleDownload}
                    canDownload={canDownload}
                    tizada={tizada}
                    sidebarState={sidebarState}
                />
            </Box>
            
            <Box sx={{ 
                p: 2, 
                borderTop: '1px solid #ccc', 
                textAlign: 'center',
                marginRight: `${sidebarState.effectiveWidth}px`,
                width: `calc(100% - ${sidebarState.effectiveWidth}px)`, // Change this
                transition: 'width 0.2s' // Optional: smooth width transition
            }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/tizadas')}
                >
                    Volver a Mis Tizadas
                </Button>
            </Box>
            
            <Snackbar 
                open={error !== null} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
            >
                <Alert onClose={() => setError(null)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar 
                open={success} 
                autoHideDuration={6000} 
                onClose={() => setSuccess(false)}
            >
                <Alert onClose={() => setSuccess(false)} severity="success">
                    ¡Optimizando la tizada!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default VerTizada;
