import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoldes } from '../api/methods'
import { Molde } from '../utils/types'
import { formatDate } from '../utils/helpers'

{/* UI Components */}
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function MisMoldes() {
      const navigate = useNavigate();
      const [moldes, setMoldes] = useState<Molde[]>([]);
    
      useEffect(() => {
        fetchMoldes();
      }, []);
    
      {/*API Call*/}
      const fetchMoldes = async () => {
        try {
          const response = await getMoldes();
          if (response.status === "OK") {
            setMoldes(response.data);
          } else {
            console.error("Failed to fetch user moldes");
          }
        } catch (error) {
          console.error("Error fetching user moldes:", error);
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
            valueFormatter: formatDate,
        }
      ];
    
      const handleRowClick = (params: GridRowParams) => {
        navigate(`/moldes/molde/${params.row.uuid}`);
      };
      
       return (
                <Container>
                {/* Title and Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography color="black" variant="h4">Mis Moldes</Typography>
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
                    rows={moldes}
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
                    checkboxSelection={false}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
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
                </Container>
       );
   }
   
   export default MisMoldes