import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteMoldes, getMoldes} from '../api/methods'
import {Molde} from '../utils/types'
import {formatDate} from '../utils/helpers'
import {useUserContext} from "../components/Login/UserProvider.tsx";
import { getFontFamily } from '../utils/fonts';

import CustomToolbar from "../components/CustomToolbar";
import PageLayout from '../components/layout/PageLayout';
import {DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import {esES} from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

{/* UI Components */}

function MisMoldes() {
      const navigate = useNavigate();
      const [moldes, setMoldes] = useState<Molde[]>([]);
      const { userData } = useUserContext();
    
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
        { field: 'name', headerName: 'Nombre', width: 100, editable: true },
        { field: 'description', headerName: 'Descripción', width: 150, editable: true },
        { 
          field: 'createdAt', 
          headerName: 'Fecha de Creación', 
          width: 180,
          valueFormatter: formatDate,
        },
        { 
            field: 'updatedAt', 
            headerName: 'Ultima Actualización', 
            width: 180,
            renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : 'Sin cambios',
        }
      ];
    
      const handleRowClick = (params: GridRowParams) => {
        navigate(`/moldes/molde/${params.row.uuid}`);
      };
      
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
                    rows={moldes || []}
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
                    onRowClick={handleRowClick}
                    slots={{
                      toolbar: CustomToolbar,
                    }}
                    slotProps={{
                      toolbar: {
                        onDelete: handleDelete,
                      },
                    }}
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
                </PageLayout>
       );
   }
   
   export default MisMoldes
