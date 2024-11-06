import {useEffect, useState} from 'react'; //, useCallback
import {useNavigate} from 'react-router-dom';
import {getFabrics, getPrendas, getRollos, updateRollo, updatePrenda, updateFabric} from '../api/methods'; // Llamadas a la API
import {FabricPiece, Prenda, RolloDeTela} from '../utils/types'; // Entidades
import EditableNumericCell from '../components/EditableNumericCell';
import PageLayout from '../components/layout/PageLayout';
import NuevoRolloModal from "./NuevoRollo.tsx";
import ConvertirRolloModal from "./ConvertirRollo.tsx";
import ConvertirPrendaModal from "./ConvertirPrendaModal.tsx";
import { getFontFamily } from '../utils/fonts';

import {DataGrid, GridColDef} from '@mui/x-data-grid'; // , GridRowParams
import {esES} from '@mui/x-data-grid/locales';
import {Box, Typography, Button} from '@mui/material';

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

    const [editingStockId, setEditingStockId] = useState<string | null>(null);
    const [editedStockValue, setEditedStockValue] = useState<number>(0);

    const handleStockEdit = (id: string, type: 'rollo' | 'fabric' | 'prenda', currentValue: number) => {
        setEditingStockId(id);
        setEditedStockValue(currentValue);
        console.log('Editing started:', { id, type, currentValue }); // For debugging
    };

    const handleStockSave = async (id: string, type: 'rollo' | 'fabric' | 'prenda') => {
        try {
          let response;
          switch (type) {
            case 'rollo':
              response = await updateRollo(id, { stock: editedStockValue });
              if (response.status === "OK") fetchRollos();
              break;
            case 'fabric':
              response = await updateFabric(id, { stock: editedStockValue });
              if (response.status === "OK") fetchFabrics();
              break;
            case 'prenda':
              response = await updatePrenda(id, { stock: editedStockValue });
              if (response.status === "OK") fetchPrendas();
              break;
          }
          setEditingStockId(null);
        } catch (error) {
          console.error('Error saving stock:', error);
        }
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

    {/* Rollos de tela */}
    const rolloColumns: GridColDef[] = [
        {field: 'name', headerName: 'Artículo', editable: false, width: 150},
        {
            field: 'color',
            headerName: 'Color',
            width: 100,
            editable: false,
            valueGetter: (_, row) => row.color.name,
            flex: 0.75
        },
        {
            field: 'stock',
            headerName: 'Stock',
            width: 200,
            flex: 0,
            align: 'left', // Add this
            headerAlign: 'left', // Add this
            renderCell: (params) => (
                <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center', // Vertical center
                    justifyContent: 'flex-start', // Left align
                }}>
                    <EditableNumericCell
                    value={params.row.stock}
                    row={params.row}
                    isEditing={editingStockId === params.row.fabricRollId}
                    onEdit={(id) => handleStockEdit(id, 'rollo', params.row.stock)}
                    onSave={() => handleStockSave(params.row.fabricRollId, 'rollo')}
                    onCancel={() => setEditingStockId(null)}
                    onChange={setEditedStockValue}
                    min={0}
                />
                </Box>
                
            )
          }    
        ];

    {/* Moldes cortados */}
    const fabricColumns: GridColDef[] = [
        {
            field: 'molde',
            headerName: 'Molde Artículo',
            editable: false,
            valueGetter: (_, row) => row.molde.name,
            width:200
        },
        {
            field: 'description',
            headerName: 'Descripción',
            editable: false,
            valueGetter: (_, row) => row.molde.description,
            flex: 1
        },
        {field: 'rollo', headerName: 'Rollo', editable: false, valueGetter: (_, row) => row.fabricRoll.name, flex: 0.75},
        {
            field: 'stock',
            headerName: 'Stock',
            flex: 0,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center', // Vertical center
                    justifyContent: 'flex-start', // Left align
                }}>
                <EditableNumericCell
                  value={params.row.stock}
                  row={params.row}
                  isEditing={editingStockId === params.row.fabricPieceId}
                  onEdit={(id) => handleStockEdit(id, 'fabric', params.row.stock)}
                  onSave={() => handleStockSave(params.row.fabricPieceId, 'fabric')}
                  onCancel={() => setEditingStockId(null)}
                  onChange={setEditedStockValue}
                  min={0}
                />
                </Box>
            )
          }
    ];

    {/* Prendas */}
    const prendaColumns: GridColDef[] = [
        {field: 'article', headerName: 'Artículo', editable: false, width: 150},
        {field: 'description', headerName: 'Descripción', editable: false, flex: 1, width: 250},
        {
            field: 'stock',
            headerName: 'Stock',
            flex: 0,
            width: 200,
            renderCell: (params) => (
                <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center', // Vertical center
                    justifyContent: 'flex-start', // Left align
                }}>
                <EditableNumericCell
                  value={params.row.stock}
                  row={params.row}
                  isEditing={editingStockId === params.row.garmentId}
                  onEdit={(id) => handleStockEdit(id, 'prenda', params.row.stock)}
                  onSave={() => handleStockSave(params.row.garmentId, 'prenda')}
                  onCancel={() => setEditingStockId(null)}
                  onChange={setEditedStockValue}
                  min={0}
                />
                </Box>
            )
          }
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
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-scrollbar--horizontal': {
                            display: 'block',
                        },
                    }}
                    pageSizeOptions={[5]}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    checkboxSelection={true}
                    disableRowSelectionOnClick
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
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-scrollbar--horizontal': {
                            display: 'block',
                        },
                    }}
                    pageSizeOptions={[5]}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    disableRowSelectionOnClick
                    
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
                        Coser Prenda
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
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-scrollbar--horizontal': {
                            display: 'block',
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection={true}
                    disableRowSelectionOnClick
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedPrendasData = prendas.filter((prenda) =>
                            newSelection.includes(prenda.garmentId)
                        );
                        setSelectedPrendas(selectedPrendasData);
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
