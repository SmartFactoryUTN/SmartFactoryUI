import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function MisTizadas() {
    const navigate = useNavigate();
    const columns: GridColDef<(typeof rows)[number]>[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'nombre',
          headerName: 'Nombre',
          width: 150,
          editable: true,
        },
        {
            field: 'estado',
            headerName: 'Estado', //Creada En proceso Terminada Error
            width: 100,
          },
        {
          field: 'fecha',
          headerName: 'Fecha de Creación',
          width: 150,
        },
        {
          field: 'actualizacion',
          headerName: 'Ultima Actualización',
          width: 160,
        },
        {
            field: 'etapa',
            headerName: 'Etapa', //Esperando las telas, pendiente de cortar, enviado cortador, cortada, 
            width: 100,
          },
      ];    
    
      const rows = [
        { id: 1, nombre: 'MiTizada', estado: 'en corte', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 2, nombre: 'Esta tizada tiene: remera1, remera2, musculosa, short, pantalon mangas largas', estado: 'en corte', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 3, nombre: 'Prueba', estado: 'no enviada', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 4, nombre: 'Prueba2', estado: 'no enviada', fecha: '03/08/2024', actualizacion: '03/08/2024'},
      ];
    const handleRowClick = () => {
            navigate(`/tizadas/tizada`);
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
                    rows={rows}
                    columns={columns}
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
