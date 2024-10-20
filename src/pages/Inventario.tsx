import {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {getRollos, getPrendas, getFabrics} from '../api/methods'; // Llamadas a la API
import {RolloDeTela, Prenda, FabricPiece} from '../utils/types'; // Entidades

{/* UI Components */
}
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {esES} from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PageLayout from '../components/layout/PageLayout';
import NuevoRolloModal from "./NuevoRollo.tsx";


function Inventario() {
    const navigate = useNavigate();

    const [rollos, setRollos] = useState<RolloDeTela[]>([]);
    const [fabrics, setFabrics] = useState<FabricPiece[]>([]);
    const [prendas, setPrendas] = useState<Prenda[]>([]);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSave = () => {
        // Manejar la creación de un nuevo rollo aquí
        setOpenModal(false);
    };

// Traer rollos, prendas y fabrics del back
    useEffect(() => {
        fetchRollos();
        fetchPrendas();
        fetchFabrics();
    }, []);

    const fetchRollos = async () => {
        try {
            const response = await getRollos();
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
            if (response.status === "success") {
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
            if (response.status === "success") {
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
        {field: 'name', headerName: 'Nombre', editable: false, flex: 1},
        {
            field: 'color',
            headerName: 'Color',
            width: 200,
            editable: false,
            valueGetter: (_, row) => row.color.name,
            flex: 0.75
        },
        {field: 'stock', headerName: 'Stock', minWidth: 125, editable: false, flex: 0},
    ];

    const fabricColumns: GridColDef[] = [
        {
            field: 'molde',
            headerName: 'Nombre del molde',
            editable: false,
            valueGetter: (_, row) => row.molde.name,
            flex: 1
        },
        {field: 'color', headerName: 'Color', editable: false, valueGetter: (_, row) => row.color.name, flex: 0.75},
        {field: 'stock', headerName: 'Stock', editable: false, flex: 0, minWidth: 125}
        // Otras columnas para la tabla de moldes cortados
    ];

    const prendaColumns: GridColDef[] = [
        {field: 'name', headerName: 'Nombre', editable: false, flex: 1},
        {field: 'stock', headerName: 'Stock', editable: false, flex: 0, minWidth: 125},
        // Otras columnas para la tabla de prendas
    ];


    return (
        <PageLayout>
            {/* Title */}
            <Typography color="black" variant="h4" sx={{mb: 4}}>Inventario</Typography>

            {/* Rollos de Tela Table */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h5" sx={{mb: 2}}>Rollos de Tela</Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{marginBottom: 2, minWidth: "20px", minHeight: "20px"}}>
                        {/*<Typography variant="h5">+</Typography>*/}
                        Nuevo rollo
                    </Button>
                </Box>
            </Box>
            <Box sx={{height: '400', width: '100%', mb: 4}}>
                <DataGrid
                    rows={rollos}
                    columns={rolloColumns}
                    getRowId={(row) => row.fabricRollId}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    checkboxSelection={true}
                />
            </Box>

            {/* Fabrics Table */}
            <Typography variant="h5" sx={{mb: 2}}>Moldes Cortados</Typography>
            <Box sx={{height: 400, width: '100%', mb: 4}}>
                <DataGrid
                    rows={fabrics}
                    columns={fabricColumns}
                    getRowId={(row) => row.fabricPieceId}
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
            <Typography variant="h5" sx={{mb: 2}}>Prendas</Typography>
            <Box sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={prendas}
                    columns={prendaColumns}
                    getRowId={(row) => row.garmentId}
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
            <NuevoRolloModal
                open={openModal}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </PageLayout>
    );
}

export default Inventario;
