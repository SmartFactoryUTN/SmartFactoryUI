import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteMoldes, getMoldes, editMoldeName} from '../api/methods'
import {Molde} from '../utils/types'
import {formatDate} from '../utils/helpers'
import {useUserContext} from "../components/Login/UserProvider.tsx";
import { getFontFamily } from '../utils/fonts';

import CustomToolbar from "../components/CustomToolbar";
import PageLayout from '../components/layout/PageLayout';
import {DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import {esES} from '@mui/x-data-grid/locales';
import {Button, TextField, IconButton, Alert, Snackbar, Typography, Box, Dialog, DialogTitle, DialogActions, DialogContent} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

{/* UI Components */}

function MisMoldes() {
      const navigate = useNavigate();
      const [moldes, setMoldes] = useState<Molde[]>([]);
      const { userData } = useUserContext();
      const [isPreviewOpen, setIsPreviewOpen] = useState(false);
      const [selectedMoldeUrl, setSelectedMoldeUrl] = useState<string | null>(null);
      const [selectedMoldeName, setSelectedMoldeName] = useState<string>('');
      const [error, setError] = useState<string | null>(null);
      const [success, setSuccess] = useState(false);
      const [editingId, setEditingId] = useState<string | null>(null);
      const [originalValue, setOriginalValue] = useState<string>('');

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

      const handleEditCellChange = async (params: any) => {
        if (params.field === 'name') {
          try {
            const response = await editMoldeName(params.id, params.value);
            if (response.status === "OK") {
              setSuccess(true);
              fetchMoldes();
            } else {
              setError("Error al actualizar el nombre");
            }
          } catch (err) {
            setError("Error al actualizar el nombre");
          }
        }
      };

      // Add these handler functions
      const handleStartEdit = (id: string) => {
        const molde = moldes.find(m => m.uuid === id);
        if (molde) {
          setOriginalValue(molde.name);
          setEditingId(id);
        }
      };

      const handleSave = async (id: string, newValue: string) => {
        const molde = moldes.find(m => m.uuid === id);
        if (!molde) return;
      
        try {
          const response = await editMoldeName(id, molde.name);
          if (response.status === "OK") {
            setSuccess(true);
            setEditingId(null);
            fetchMoldes();
          } else {
            setError("Error al actualizar el nombre");
          }
        } catch (err) {
          setError("Error al actualizar el nombre");
        }
      };

      const handleCancel = () => {
        setEditingId(null);
        fetchMoldes(); // Refresh to get original values
      };
    
      const columns: GridColDef[] = [
        { 
          field: 'name', 
          headerName: 'Nombre', 
          width: 200,
          editable: false, // Change this to false to prevent double-click editing
          renderCell: (params) => {
            const isInEditMode = params.row.isEditing;
        
            if (isInEditMode) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <TextField
                    value={params.value}
                    size="small"
                    autoFocus
                    fullWidth
                    onChange={(e) => {
                      const molde = moldes.find(m => m.uuid === params.row.uuid);
                      if (molde) {
                        setMoldes(moldes.map(m => 
                          m.uuid === params.row.uuid 
                            ? { ...m, name: e.target.value }
                            : m
                        ));
                      }
                    }}
                  />
                  <Box sx={{ ml: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(params.row.uuid, params.value);
                      }}
                    >
                      <CheckIcon fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                      }}
                    >
                      <CloseIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Box>
              );
            }
        
            return (
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  width: '100%',
                  '& .edit-button': {
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  },
                  '&:hover .edit-button': {
                    opacity: 1
                  }
                }}
              >
                <div>{params.value}</div>
                <IconButton
                  className="edit-button"
                  size="small"
                  sx={{ ml: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(params.row.uuid);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          }
        },
        { field: 'description', headerName: 'Descripción', width: 150, editable: false }, //FIX: allow edit
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
        }
      ];
    

      {/*PREVIEW DEL MOLDE*/}
      {/*
      const handleRowClick = (params: GridRowParams) => {
        setSelectedMoldeUrl(params.row.url);
        setSelectedMoldeName(params.row.name);
        setIsPreviewOpen(true);
      };*/}
      
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
                  processRowUpdate={handleEditCellChange} // Add this line
                  sx={{
                    '& .MuiDataGrid-row': {
                      cursor: 'pointer',
                    },
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
                    Nombre actualizado exitosamente
                  </Alert>
                </Snackbar>
                </PageLayout>
       );
   }
   
   export default MisMoldes
