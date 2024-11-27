import {useEffect, useState} from 'react'; //, useCallback
import {useNavigate} from 'react-router-dom';
import {
    getFabrics,
    getPrendas,
    getRollos,
    updateRollo,
    updatePrenda,
    updateFabric,
    deleteRollos, deleteFabrics, deletePrendas
} from '../api/methods'; // Llamadas a la API
import {FabricPiece, Prenda, RolloDeTela} from '../utils/types'; // Entidades
import EditableNumericCell from '../components/EditableNumericCell';
import PageLayout from '../components/layout/PageLayout';
import NuevoRolloModal from "./NuevoRollo.tsx";
import ConvertirRolloModal from "./ConvertirRollo.tsx";
import ConvertirPrendaModal from "./ConvertirPrendaModal.tsx";

import {DataGrid, GridColDef} from '@mui/x-data-grid'; // , GridRowParams
import {esES} from '@mui/x-data-grid/locales';
import {Box, Button, Tooltip, IconButton} from '@mui/material';
import CustomToolbar from "../components/CustomToolbar.tsx";
import EditableCell from "../components/EditableCell.tsx";
import {useEditManager} from "../components/hooks/useEditManager.tsx";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { MainTitle, SectionTitle } from '../components/TitleTypographies';
import { GridToolbarProps} from '@mui/x-data-grid';

{/* UI Components */
}

function Inventario() {
    const navigate = useNavigate();

    const [rollos, setRollos] = useState<RolloDeTela[]>([]);
    const [fabrics, setFabrics] = useState<FabricPiece[]>([]);
    const [prendas, setPrendas] = useState<Prenda[]>([]);

    const [selectedRollos, setSelectedRollos] = useState<RolloDeTela[]>([]);
    const [selectedPrendas, setSelectedPrendas] = useState<Prenda[]>([]);

    const [openModalRollo, setOpenModalRollo] = useState<boolean>(false);
    const [openConvertirRolloModal, setOpenConvertirRolloModal] = useState<boolean>(false);

    const [, setError] = useState<string | null>(null); // FIXME: volver a agregar error
    const [, setSuccess] = useState(false); // FIXME: volver a agregar success

    const {
        editingId: editingIdRollo,
        editingField: editingFieldRollo,
        editedValue: editedValueRollo,
        startEdit: startEditRollo,
        saveEdit: saveEditRollo,
        cancelEdit: cancelEditRollo,
        setEditedValue: setEditedValueRollo
    } = useEditManager({
        entityType: 'rollo',
        onSuccess: () => {
            setSuccess(true);
            fetchRollos();
        },
        onError: (msg: string) => setError(msg)
    });

    const {
        editingId: editingIdPrenda,
        editingField: editingFieldPrenda,
        editedValue: editedValuePrenda,
        startEdit: startEditPrenda,
        saveEdit: saveEditPrenda,
        cancelEdit: cancelEditPrenda,
        setEditedValue: setEditedValuePrenda
    } = useEditManager({
        entityType: 'prenda',
        onSuccess: () => {
            setSuccess(true);
            fetchPrendas();
        },
        onError: (msg: string) => setError(msg)
    });

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

    const handleConversionRollosSuccess = () => {
        fetchRollos();
        fetchFabrics();
    }

    const handleOpenConvertirModal = () => {
        const rollosSeleccionadosData = rollos.filter((rollo) =>
            selectedRollos.map((r) => r.fabricRollId).includes(rollo.fabricRollId)
        );
        setSelectedRollos(rollosSeleccionadosData);
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
        console.log('Editing started:', {id, type, currentValue}); // For debugging
    };

    const handleStockSave = async (id: string, type: 'rollo' | 'fabric' | 'prenda') => {
        try {
            let response;
            switch (type) {
                case 'rollo':
                    response = await updateRollo(id, {stock: editedStockValue});
                    if (response.status === "OK") fetchRollos();
                    break;
                case 'fabric':
                    response = await updateFabric(id, {stock: editedStockValue});
                    if (response.status === "OK") fetchFabrics();
                    break;
                case 'prenda':
                    response = await updatePrenda(id, {stock: editedStockValue});
                    if (response.status === "OK") fetchPrendas();
                    break;
            }
            setEditingStockId(null);
        } catch (error) {
            console.error('Error saving stock:', error);
        }
    };

    const handleDeleteFabrics = async (selectedIds: string[]) => {
        try {
            const response = await deleteFabrics(selectedIds);
            if (response.status === "success") {
                fetchFabrics();
            } else {
                console.error("Failed to delete some or all fabric pieces");
            }
        } catch (error) {
            console.error("Error deleting fabric pieces:", error);
        }
    };

    const handleDeleteGarments = async (selectedIds: string[]) => {
        try {
            const response = await deletePrendas(selectedIds);
            if (response.status === "success") {
                fetchPrendas();
            } else {
                console.error("Failed to delete some or all garments");
            }
        } catch (error) {
            console.error("Error deleting garments:", error);
        }
    };

    const handleDeleteRolls = async (selectedIds: string[]) => {
        try {
            const response = await deleteRollos(selectedIds);
            if (response.status === "success") {
                fetchRollos();
            } else {
                console.error("Failed to delete some or all rolls");
            }
        } catch (error) {
            console.error("Error deleting rolls:", error);
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

    {/* Rollos de tela */
    }
    const rolloColumns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Artículo de rollo',
            width: 150,
            renderCell: (params) => (
                <EditableCell
                    value={editingIdRollo === params.row.fabricRollId && editingFieldRollo === 'name' ? editedValueRollo : params.row.name}
                    row={params.row}
                    field="name"
                    idField="fabricRollId"
                    isEditing={params.row.fabricRollId === editingIdRollo && editingFieldRollo === 'name'}
                    onEdit={(id) => startEditRollo(id, 'name', params.row.name)}
                    onSave={(id) => saveEditRollo(id, 'name')}
                    onCancel={cancelEditRollo}
                    onChange={setEditedValueRollo}
                />
            )
        },
        {
            field: 'description',
            headerName: 'Descripción',
            width: 250,
            renderCell: (params) => (
                <EditableCell
                    value={editingIdRollo === params.row.fabricRollId && editingFieldRollo === 'description' ? editedValueRollo : params.row.description}
                    field="description"
                    idField="fabricRollId"
                    row={params.row}
                    isEditing={params.row.fabricRollId === editingIdRollo && editingFieldRollo === 'description'}
                    onEdit={(id) => {
                        startEditRollo(id, 'description', params.row.description);
                    }}
                    onSave={(id) => saveEditRollo(id, 'description')}
                    onCancel={cancelEditRollo}
                    onChange={setEditedValueRollo}
                />
            )
        },
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

    {/* Moldes cortados */
    }
    const fabricColumns: GridColDef[] = [
        {
            field: 'molde',
            headerName: 'Artículo de molde',
            editable: false,
            valueGetter: (_, row) => row.molde.name,
            width: 200
        },
        {
            field: 'description',
            headerName: 'Descripción',
            editable: false,
            valueGetter: (_, row) => row.molde.description,
            flex: 1
        },
        {
            field: 'rollo',
            headerName: 'Rollo',
            editable: false,
            valueGetter: (_, row) => row.fabricRoll.name,
            flex: 0.75
        },
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

    {/* Prendas */
    }
    const prendaColumns: GridColDef[] = [
        {
            field: 'article', headerName: 'Artículo', editable: false, width: 150,
            renderCell: (params) => (
                <EditableCell
                    value={editingIdPrenda === params.row.garmentId && editingFieldPrenda === 'article' ? editedValuePrenda : params.row.article}
                    field="article"
                    idField="garmentId"
                    row={params.row}
                    isEditing={params.row.garmentId === editingIdPrenda && editingFieldPrenda === 'article'}
                    onEdit={(id) => {
                        startEditPrenda(id, 'article', params.row.article);
                    }}
                    onSave={(id) => saveEditPrenda(id, 'article')}
                    onCancel={cancelEditPrenda}
                    onChange={setEditedValuePrenda}
                />
            )
        },
        {
            field: 'description',
            headerName: 'Descripción',
            editable: false,
            flex: 1,
            width: 250,
            renderCell: (params) => (
                <EditableCell
                    value={editingIdPrenda === params.row.garmentId && editingFieldPrenda === 'description' ? editedValuePrenda : params.row.description}
                    field="description"
                    idField="garmentId"
                    row={params.row}
                    isEditing={params.row.garmentId === editingIdPrenda && editingFieldPrenda === 'description'}
                    onEdit={(id) => {
                        startEditPrenda(id, 'description', params.row.description);
                    }}
                    onSave={(id) => saveEditPrenda(id, 'description')}
                    onCancel={cancelEditPrenda}
                    onChange={setEditedValuePrenda}
                />
            )
        },
        {
            field: 'rolls',
            headerName: 'Rollos',
            editable: false,
            flex: 1,
            valueGetter: (_, row) => row.fabricPieces[0].fabricRoll.name
        },
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
        },
        {
            field: 'preview',
            headerName: '',
            flex: 0,
            width: 50,
            renderCell: (params) => (
                <Tooltip title="Ver detalle">
                <IconButton
                    onClick={() => navigate(`/inventario/prendas/${params.row.garmentId}`)}
                    sx={{minWidth: 'auto', padding: 0}}
                >
                    <VisibilityIcon/>
                </IconButton>
                </Tooltip>
            )
        }
    ];


    return (
        <PageLayout>
            {/* Title */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2}}>
                <MainTitle>Inventario</MainTitle>
            </Box>


            {/* Rollos de Tela Table */}
            <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <SectionTitle>Rollos de Tela</SectionTitle>
            <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}
                            sx={{mb: 2, minWidth: "20px", minHeight: "20px"}}>
                        {/*<Typography variant="h5">+</Typography>*/}
                        Nuevo rollo
                    </Button>
                </Box>
            </Box>
            <Box sx={{height: '400', width: '100%', mb: 4}}>
                <DataGrid
                    rows={rollos?.map(rollo => ({
                        ...rollo,
                        isEditing: rollo.fabricRollId === editingIdRollo
                    })) || []}
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
                    localeText={{...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: ""}}
                    checkboxSelection={true}
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedRollosData = rollos.filter((rollo) =>
                            newSelection.includes(rollo.fabricRollId)
                        );
                        setSelectedRollos(selectedRollosData);
                    }}
                    slots={{
                        toolbar: CustomToolbar as React.ComponentType<GridToolbarProps>,
                    }}
                    slotProps={{
                        toolbar: {
                            actions: ['cut', 'delete'],
                            tooltipText: "Seleccione uno o varios rollos",
                            onDelete: handleDeleteRolls,
                            onCut: handleOpenConvertirModal,
                        },
                    }}
                />
            </Box>
            </Box>

            {/* Fabrics Table */}
            <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <SectionTitle>Moldes Cortados</SectionTitle>
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
                    checkboxSelection={true}
                    pageSizeOptions={[5]}
                    localeText={{...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: ""}}
                    disableRowSelectionOnClick
                    slots={{
                        toolbar: CustomToolbar as React.ComponentType<GridToolbarProps>,
                    }}
                    slotProps={{
                        toolbar: {
                            actions: ['delete'],
                            tooltipText: "Seleccione uno o varios moldes cortados",
                            onDelete: handleDeleteFabrics,
                        },
                    }}
                />
            </Box>
            </Box>
            

            {/* Prendas Table */}
            <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <SectionTitle>Prendas</SectionTitle>
            <Box sx={{display: "flex", alignItems: "center"}}>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/inventario/prenda/crear`)}
                            sx={{mb: 2, minWidth: "20px", minHeight: "20px"}}>
                        Crear prenda
                    </Button>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '400'}}>
                <DataGrid
                    rows={prendas?.map(prenda => ({
                        ...prenda,
                        isEditing: prenda.garmentId === editingIdPrenda
                    })) || []}
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
                        '& .MuiDataGrid-overlay': {
                            visibility: prendas.length === 0 ? 'none !important' : 'flex',
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection={true}
                    disableRowSelectionOnClick
                    localeText={{...esES.components.MuiDataGrid.defaultProps.localeText, noRowsLabel: ""}}
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedPrendasData = prendas.filter((prenda) =>
                            newSelection.includes(prenda.garmentId)
                        );
                        setSelectedPrendas(selectedPrendasData);
                    }}
                    slots={{
                        toolbar: CustomToolbar as React.ComponentType<GridToolbarProps>,
                    }}
                    slotProps={{
                        toolbar: {
                            actions: ['sew', 'delete'],
                            tooltipText: "Seleccione una o varias prendas",
                            onDelete: handleDeleteGarments,
                            onSew: handleOpenConvertirPrendaModal,
                        },
                    }}
                />
            </Box>
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
            onClose={() => setOpenConvertirPrendaModal(false)}
            selectedPrendas={selectedPrendas}
            onConversionSuccess={() => {
                fetchFabrics();
                fetchPrendas();
            }}
            />
        </PageLayout>
    );
}

export default Inventario;
