import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteMoldes, getMoldes} from '../api/methods'
import {Molde} from '../utils/types'
import {formatDate} from '../utils/helpers'
import {useUserContext} from "../components/Login/UserProvider.tsx";
import EditableCell from "../components/EditableCell.tsx";
import { getFontFamily } from '../utils/fonts';
import { useEditManager } from '../components/hooks/useEditManager';
import CustomToolbar from "../components/CustomToolbar";
import PageLayout from '../components/layout/PageLayout';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {esES} from '@mui/x-data-grid/locales';
import {Button, Alert, Snackbar, Typography, Box, IconButton, Dialog, DialogTitle, DialogActions, DialogContent} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

//, GridRowParams

{/* UI Components */}

function MisMoldes() {
      const navigate = useNavigate();
      const [moldes, setMoldes] = useState<Molde[]>([]);
      const { userData } = useUserContext();
      const [error, setError] = useState<string | null>(null);
      const [success, setSuccess] = useState(false);
      const { 
        editingId, 
        editingField,
        editedValue,
        startEdit,
        saveEdit,
        cancelEdit,
        setEditedValue 
      } = useEditManager({ 
        entityType: 'molde',
        onSuccess: () => {
          setSuccess(true);
          fetchMoldes();
        },
        onError: (msg: string) => setError(msg)
      });
      const [isPreviewOpen, setIsPreviewOpen] = useState(false);
      const [selectedMoldeUrl, setSelectedMoldeUrl] = useState<string | null>(null);
      const [selectedMoldeName, setSelectedMoldeName] = useState<string | null>(null);
    

      useEffect(() => {
        fetchMoldes();
      }, [userData]);
    
      {/*API Call*/}
      const fetchMoldes = async () => {
        try {
          // @ts-expect-error "skipped"
          const response = await getMoldes(userData?.id);
          if (response.status === "success") {
            // @ts-expect-error "skipped"
            setMoldes(response.data.moldes);
          } else {
            console.error("Failed to fetch user moldes");
          }
        } catch (error) {
          console.error("Error fetching user moldes:", error);
        }
      };
    
      const handleDelete = async (selectedIds: string[]) => {
        try {
          const response = await deleteMoldes(selectedIds);
          if (response.status === "success") {
            fetchMoldes();
          } else {
            console.error("Failed to delete some or all moldes");
          }
        } catch (error) {
          console.error("Error deleting moldes:", error);
        }
      };

      const columns: GridColDef[] = [
        { 
          field: 'name', 
          headerName: 'Artículo', 
          width: 170,
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
          field: 'description', 
          headerName: 'Descripción', 
          width: 200,
          editable: false,
          renderCell: (params) => (
            <EditableCell
              value={editingId === params.row.uuid && editingField === 'description' 
                ? editedValue 
                : params.row.description} 
              row={params.row}
              field="description"
              isEditing={params.row.uuid === editingId && editingField === 'description'}
              onEdit={(id) => startEdit(id, 'description', params.row.description)}  
              onSave={(id) => saveEdit(id, 'description')}
              onCancel={cancelEdit}
              onChange={setEditedValue}
            />
          )
        },
        { 
          field: 'createdAt', 
          headerName: 'Fecha de Creación', 
          width: 180,
          valueFormatter: formatDate,
          editable: false
        },
        { 
            field: 'updatedAt', 
            headerName: 'Ultima Actualización', 
            width: 180,
            editable: false,
            renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : 'Sin cambios',
        },
        {
          field: 'actions',
          headerName: '',
          width: 70,
          sortable: false,
          filterable: false,
          renderCell: (params) => (
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent row selection
                {/*PREVIEW DEL MOLDE*/}
                setSelectedMoldeUrl(params.row.url);
                setSelectedMoldeName(params.row.name);
                setIsPreviewOpen(true);
              }}
              size="small"
              //color="primary"
            >
              <VisibilityIcon />
            </IconButton> 
          ),
        }
      ];
    

      
       return (
                <PageLayout>
                {/* Title and Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography color="black" variant="h4" sx={{fontFamily: getFontFamily('bodoni')}}>
                      Mis Moldes
                    </Typography>
                  <Box>
                    <Button variant="contained" color="primary" onClick={() => navigate('/moldes/crear')} sx={{ marginRight: 1 }}>
                        Digitalizar
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => navigate('/moldes/subir')}>
                        Subir
                    </Button>
                    </Box>
                </Box>
                
                {/* Data Table */}
                
                <DataGrid
                  rows={moldes?.map(molde => ({
                    ...molde,
                    isEditing: molde.uuid === editingId
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
                  // onRowClick={handleRowClick}
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  slotProps={{
                    toolbar: {
                      onDelete: handleDelete,
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

                <Dialog 
                  open={isPreviewOpen}
                  onClose={() => setIsPreviewOpen(false)}
                  maxWidth="md"
                  fullWidth
                >
                  
                  <DialogTitle>Vista Previa del Molde {selectedMoldeName}</DialogTitle>
                  <DialogContent>
                    {selectedMoldeUrl && (
                      <object
                        type="image/svg+xml"
                        data={selectedMoldeUrl}
                        style={{
                          width: '100%',
                          height: '500px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          marginTop: '16px'
                        }}
                      >
                        Su navegador no soporta SVGs
                      </object>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsPreviewOpen(false)}>
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>
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
   
   export default MisMoldes
