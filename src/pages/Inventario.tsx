import {useEffect, useState} from 'react'; //, useCallback
import {useNavigate} from 'react-router-dom';
import {getFabrics, getPrendas, getRollos} from '../api/methods'; // Llamadas a la API
import {FabricPiece, Prenda, RolloDeTela} from '../utils/types'; // Entidades
import {DataGrid, GridColDef} from '@mui/x-data-grid'; // , GridRowParams
import {esES} from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PageLayout from '../components/layout/PageLayout';
import NuevoRolloModal from "./NuevoRollo.tsx";
import ConvertirRolloModal from "./ConvertirRollo.tsx";
import ConvertirPrendaModal from "./ConvertirPrendaModal.tsx";
import { getFontFamily } from '../utils/fonts';

{/* UI Components */}

function Inventario() {
    const navigate = useNavigate();

    const [rollos, setRollos] = useState<RolloDeTela[]>([]);
    const [fabrics, setFabrics] = useState<FabricPiece[]>([]);
    const [prendas, setPrendas] = useState<Prenda[]>([]);

    const [selectedRollos, setSelectedRollos] = useState<RolloDeTela[]>([]);
    const [selectedPrendas, setSelectedPrendas] = useState<Prenda[]>([]);

    const [openModalRollo, setOpenModalRollo] = useState<boolean>(false);
    const [openConvertirRolloModal, setOpenConvertirRolloModal] = useState<boolean>(false);

    const handleOpenModal = () => {
        setOpenModalRollo(true);
    };

    const handleCloseModal = () => {
        setOpenModalRollo(false);
    };

    const handleSaveRollo = () => {
        fetchRollos();
    };

    const [openConvertirPrendaModal, setOpenConvertirPrendaModal] = useState<boolean>(false);

    const handleOpenConvertirPrendaModal = () => {
        setOpenConvertirPrendaModal(true);
    };

    const handleCloseConvertirPrendaModal = () => {
        setOpenConvertirPrendaModal(false);
    };

    const handleConversionRollosSuccess = () => {
        fetchRollos();
        fetchFabrics();
    }

    const handleConversionPrendasSuccess = () => {
        fetchFabrics();
        fetchPrendas();
    }

    const handleOpenConvertirModal = () => {
        const rollosSeleccionadosData = rollos.filter((rollo) =>
            selectedRollos.map((r) => r.fabricRollId).includes(rollo.fabricRollId)
        );
        setSelectedRollos(rollosSeleccionadosData);
        console.log(rollosSeleccionadosData);
        setOpenConvertirRolloModal(true);
    };

    const handleCloseConvertirModal = () => {
        setOpenConvertirRolloModal(false);
    };

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
            const response = await getFabrics();
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


    const rolloColumns: GridColDef[] = [
        {field: 'name', headerName: 'Artículo', editable: false, flex: 1},
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
    ];

    const prendaColumns: GridColDef[] = [
        {field: 'name', headerName: 'Nombre', editable: false, flex: 1},
        {field: 'stock', headerName: 'Stock', editable: false, flex: 0, minWidth: 125},
    ];


    return (
        <PageLayout>
            {/* Title */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography color="black" variant="h4" sx={{fontFamily: getFontFamily('bodoni')}}>
                    Inventario
                </Typography>
            </Box>
                  

            {/* Rollos de Tela Table */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h5" sx={{mb: 2}}>Rollos de Tela</Typography>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenConvertirModal}
                        sx={{marginRight: 2, mb: 2}}
                        disabled={selectedRollos.length === 0}
                    >
                        Convertir
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}
                            sx={{mb: 2, minWidth: "20px", minHeight: "20px"}}>
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
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedRollosData = rollos.filter((rollo) =>
                            newSelection.includes(rollo.fabricRollId)
                        );
                        setSelectedRollos(selectedRollosData);
                    }}
                />
            </Box>

            {/* Fabrics Table */}
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h5" sx={{mb: 2}}>Moldes Cortados</Typography>
                <Box sx={{display: "flex", alignItems: "center"}}>

                </Box>
            </Box>
            <Box sx={{height: '400', width: '100%', mb: 4}}>
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
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Typography variant="h5" sx={{mb: 2}}>Prendas</Typography>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenConvertirPrendaModal}
                        sx={{marginRight: 2, mb: 2}}
                        disabled={selectedPrendas.length === 0}
                    >
                        Convertir
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/inventario/prenda/crear`)}
                            sx={{mb: 2, minWidth: "20px", minHeight: "20px"}}>
                        {/*<Typography variant="h5">+</Typography>*/}
                        Crear prenda
                    </Button>
                </Box>
            </Box>
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
                    onRowClick={(params) => {
                        const prendaSeleccionada = prendas.find((prenda) => prenda.garmentId === params.row.garmentId);
                        if (selectedPrendas.length > 0 && selectedPrendas[0].garmentId === prendaSeleccionada?.garmentId) {
                            setSelectedPrendas([]);
                        } else {
                            setSelectedPrendas(prendaSeleccionada ? [prendaSeleccionada] : []);
                        }
                    }}
                />
            </Box>
            <NuevoRolloModal
                open={openModalRollo}
                onClose={handleCloseModal}
                onSave={handleSaveRollo}
            />

            <ConvertirRolloModal
                open={openConvertirRolloModal}
                onClose={handleCloseConvertirModal}
                selectedRollos={selectedRollos}
                onConversionSuccess={handleConversionRollosSuccess}
            />

            <ConvertirPrendaModal
                open={openConvertirPrendaModal}
                onClose={handleCloseConvertirPrendaModal}
                selectedPrenda={selectedPrendas[0]}
                onConversionSuccess={handleConversionPrendasSuccess}
            />
        </PageLayout>
    );
}

export default Inventario;
