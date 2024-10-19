import { useState, useEffect } from 'react'; //, useCallback
// import { useNavigate } from 'react-router-dom';
import { getRollos, getPrendas, getFabrics } from '../api/methods'; // Llamadas a la API
import {RolloDeTela, Prenda, FabricPiece} from '../utils/types'; // Entidades

{/* UI Components */}
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // , GridRowParams
import { esES } from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import PageLayout from '../components/layout/PageLayout';


function Inventario() {
// const navigate = useNavigate();
const [rollos, setRollos] = useState<RolloDeTela[]>([]);
const [fabrics, setFabrics] = useState<FabricPiece[]>([]);
const [prendas, setPrendas] = useState<Prenda[]>([]);

// Traer rollos, prendas y fabrics del back
useEffect(() => {
fetchRollos();
fetchPrendas();
fetchFabrics();
}, []);

const fetchRollos = async () => {
    try {
        const response = await getRollos(); // Not implemented
        if (response.status === "success") {
            setRollos(response.data);
        } else {
            console.error("Failed to fetch tizadas");
        }
    } catch (error) {
        console.error("Error fetching tizadas:", error);
    }
};

const fetchFabrics = async () => {
    try {
        const response = await getFabrics(); // Not implemented
        if (response.status === "OK") {
            setFabrics(response.data); 
        } else {
            console.error("Failed to fetch tizadas");
        }
    } catch (error) {
        console.error("Error fetching tizadas:", error);
    }
};

const fetchPrendas = async () => {
    try {
        const response = await getPrendas(); // Not implemented
        if (response.status === "OK") {
            setPrendas(response.data);
        } else {
            console.error("Failed to fetch tizadas");
        }
    } catch (error) {
        console.error("Error fetching tizadas:", error);
    }
};

// Definir columnas a mostrar. Deben ser atributos de las clases definidas en utils/types.tsx

const rolloColumns: GridColDef[] = [
    { field: 'name', headerName: 'Molde Cortado', width: 200, editable: false },
    { field: 'tendidas', headerName: 'Cantidad de Tendidas', width: 200, editable: false },
    // Otras columnas para la tabla de rollos de tela
];

const fabricColumns: GridColDef[] = [
    { field: 'name', headerName: 'Molde Cortado', width: 200, editable: false },
    // Otras columnas para la tabla de moldes cortados
];

const prendaColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 200, editable: false },
    // Otras columnas para la tabla de moldes cortados
];


return (
    <PageLayout>
        {/* Title */}
        <Typography color="black" variant="h4" sx={{ mb: 4 }}>Inventario</Typography>
        
        {/* Rollos de Tela Table */}
        <Typography variant="h5" sx={{ mb: 2 }}>Rollos de Tela</Typography>
        <Box sx={{ height: 400, width: '100%', mb: 4 }}>
            <DataGrid
                rows={rollos}
                columns={rolloColumns}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                    },
                }}
                pageSizeOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>

        {/* Fabrics Table */}
        <Typography variant="h5" sx={{ mb: 2 }}>Moldes Cortados</Typography>
        <Box sx={{ height: 400, width: '100%', mb: 4 }}>
            <DataGrid
                rows={fabrics}
                columns={fabricColumns}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                    },
                }}
                pageSizeOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>

        {/* Prendas Table */}
        <Typography variant="h5" sx={{ mb: 2 }}>Prendas</Typography>
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={prendas}
                columns={prendaColumns}
                getRowId={(row) => row.id}
                initialState={{
                    pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                    },
                }}
                pageSizeOptions={[5]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>
    </PageLayout>
);
};

export default Inventario;
