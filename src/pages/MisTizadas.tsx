import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteTizadas, getTizadas, downloadFile} from '../api/methods'
import {TizadaResult} from '../utils/types'
import {formatDate, getStatusDisplay} from '../utils/helpers';
import CustomToolbar from "../components/CustomToolbar";
import PageLayout from '../components/layout/PageLayout';
import { getFontFamily } from '../utils/fonts';
import EditableCell from "../components/EditableCell.tsx";
import { useEditManager } from '../components/hooks/useEditManager';

import {DataGrid, GridColDef} from '@mui/x-data-grid'; //GridRowParams ? Maybe needed to fetch and download a tizada by ID
import {esES} from '@mui/x-data-grid/locales';
import {Box, Typography, Button, Snackbar, Alert, IconButton} from '@mui/material';
import {useUserContext} from "../components/Login/UserProvider.tsx";
import VisibilityIcon from '@mui/icons-material/Visibility';

function MisTizadas() {
    const navigate = useNavigate();
    const [tizadas, setTizadas] = useState<TizadaResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { userData } = useUserContext();
    console.log(userData);

    const { 
      editingId, 
      editingField,
      editedValue,
      startEdit,
      saveEdit,
      cancelEdit,
      setEditedValue 
    } = useEditManager({ 
      entityType: 'tizada',
      onSuccess: () => {
        setSuccess(true);
        fetchTizadas();
      },
      onError: (msg: string) => setError(msg)
    });

    useEffect(() => {
        fetchTizadas();
      }, [userData]);
    
      const fetchTizadas = async () => {
        try {
          const response = await getTizadas(userData?.id);
          if (response.status === "success") {
            // @ts-expect-error "skipped"
              setTizadas(response.data["tizadas"]);
          } else {
            console.error("Failed to fetch tizadas");
          }
        } catch (error) {
          console.error("Error fetching tizadas:", error);
        }
      };    
    
      const columns: GridColDef[] = [
        { 
          field: 'name', 
          headerName: 'Nombre', 
          width: 200,
          editable: false,
          renderCell: (params) => (
            <EditableCell
              value={editingId === params.row.uuid && editingField === 'name' 
                ? editedValue 
                : params.row.name}  
              row={params.row}
              field="name"
              isEditing={params.row.uuid === editingId && editingField === 'name'}
              onEdit={(id) => startEdit(id, 'name', params.row.name)} 
              onSave={(id) => saveEdit(id, 'name')}
              onCancel={cancelEdit}
              onChange={setEditedValue}
            />
          )
        },
        { 
          field: 'state', 
          headerName: 'Estado', 
          width: 120,
          renderCell: (params) => getStatusDisplay(params.value)
        },
        { 
          field: 'createdAt', 
          headerName: 'Fecha de Creación', 
          width: 180,
          renderCell: (params) => formatDate(params.value as string),
        },
        { 
            field: 'updatedAt', 
            headerName: 'Ultima Actualización', 
            width: 180,
            renderCell: (params) => formatDate(params.value as string),
          },
          {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row selection
                  navigate(`/tizadas/tizada/${params.row.uuid}`);
                }}
                size="small"
                //color="primary"
              >
                <VisibilityIcon />
              </IconButton> 
            ),
          }
      ];

      const handleDelete = async (selectedIds: string[]) => {
        try {
          const response = await deleteTizadas(selectedIds);
          if (response.status === "success") {
            fetchTizadas();
          } else {
            console.error("Failed to delete some or all tizadas");
          }
        } catch (error) {
          console.error("Error deleting tizadas:", error);
        }
      };

      const handleDownload = async (selectedIds: string[]) => {
        try {
          // Assuming each tizada has a url property where the SVG is stored
          const selectedTizadas = tizadas.filter(tizada => 
            selectedIds.includes(tizada.uuid)
          );
          
          // Download each selected tizada
          for (const tizada of selectedTizadas) {
            if (tizada.results && tizada.results[0]?.url) {
              await downloadFile(tizada.results[0].url);
            }
          }
        } catch (error) {
          console.error("Error downloading tizadas:", error);
          setError("Failed to download some or all tizadas");
        }
      };

       return (
                <PageLayout>
                {/* Title and Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography color="black" variant="h4" sx={{fontFamily: getFontFamily('bodoni')}}>
                      Mis Tizadas
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/tizadas/crear')}>
                        Crear Nueva
                    </Button>
                </Box>
                
                {/* Data Table */}
                <DataGrid
                    rows={tizadas?.map(tizada => ({
                      ...tizada,
                      isEditing: tizada.uuid === editingId
                    })) || []}
                    columns={columns}
                    getRowId={(row) => row.uuid}
                    initialState={{
                        pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection={true}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    disableRowSelectionOnClick
                    slots={{
                      toolbar: CustomToolbar,
                    }}
                    slotProps={{
                      toolbar: {
                        actions: ['delete', 'download'],
                        tooltipText: "Seleccione una o varias tizadas",
                        onDelete: handleDelete,
                        onDownload: handleDownload,
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
                />
                <Snackbar 
                  open={success} 
                  autoHideDuration={6000} 
                  onClose={() => setSuccess(false)}
                  >
                  <Alert onClose={() => setSuccess(false)} severity="success">
                    {`${editingField === 'name' ? 'Nombre' : 'Descripción'} actualizado exitosamente`}
                  </Alert>
                </Snackbar>
                <Snackbar 
                  open={error !== null} 
                  autoHideDuration={6000} 
                  onClose={() => setError(null)}
                >
                  <Alert onClose={() => setError(null)} severity="error">
                    {error}
                  </Alert>
                </Snackbar>
                </PageLayout>
       );
   }
   
   export default MisTizadas
