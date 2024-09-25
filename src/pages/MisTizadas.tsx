import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTizadas } from '../api/methods'
import {Tizada} from '../utils/types'
import { formatDate } from '../utils/helpers'

{/* UI Components */}
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function MisTizadas() {
      const navigate = useNavigate();
      const [tizadas, setTizadas] = useState<Tizada[]>([]);
    
      useEffect(() => {
        fetchTizadas();
      }, []);
    
      const fetchTizadas = async () => {
        try {
          const response = await getTizadas();
          if (response.status === "OK") {
            setTizadas(response.data);
          } else {
            console.error("Failed to fetch tizadas");
          }
        } catch (error) {
          console.error("Error fetching tizadas:", error);
        }
      };    
    
      const columns: GridColDef[] = [
        { field: 'uuid', headerName: 'ID', width: 220 },
        { field: 'name', headerName: 'Nombre', width: 200, editable: true },
        { field: 'state', headerName: 'Estado', width: 120 },
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
        },
      ];
    
      const handleRowClick = (params: GridRowParams) => {
        navigate(`/tizadas/tizada/${params.row.uuid}`);
      };
      
       return (
                <Container>
                {/* Title and Button */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Typography color="black" variant="h4">Mis Tizadas</Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/tizadas/crear')}>
                        Crear Nueva
                    </Button>
                </Box>
                
                {/* Data Table */}
                <DataGrid
                    rows={tizadas}
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
   
   export default MisTizadas
