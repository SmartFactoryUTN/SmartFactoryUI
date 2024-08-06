import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

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
            headerName: 'Estado',
            width: 100,
            editable: true,
          },
        {
          field: 'fecha',
          headerName: 'Fecha de Creación',
          width: 110,
        },
        {
          field: 'actualizacion',
          headerName: 'Ultima Actualización',
          width: 110,
        },
      ];    
    
      const rows = [
        { id: 1, nombre: 'MiTizada', estado: 'en corte', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 2, nombre: 'Estándar', estado: 'en corte', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 3, nombre: 'Prueba', estado: 'no enviada', fecha: '03/08/2024', actualizacion: '03/08/2024'},
        { id: 4, nombre: 'Prueba2', estado: 'no enviada', fecha: '03/08/2024', actualizacion: '03/08/2024'},
      ];
      
      const [formData, setFormData] = useState({
        ancho: '',
        largo: '',
        tiempo: '',
        porcentaje: ''
       });
   
       // Handle input change
       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
           const { name, value } = e.target;
           setFormData({
               ...formData,
               [name]: value
           });
       };
       
       // Handle form submission
       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();
   
           try {
               const response = await fetch('http://localhost:8080/api/data', { // 
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(formData)
               });
   
               if (!response.ok) {
                   throw new Error('Network response was not ok');
               }
   
               const result = await response.json();
               console.log('Success:', result);
               navigate('/tizadas/crear');
           } catch (error) {
               console.error('Error:', error);
               navigate('/tizadas/crear')
           }
       };
   
       return (
                <Box sx={{ height: '100%', width: '600px', margin: 'auto', paddingTop: 4 }}>
                    {/* Title and Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <Typography variant="h4">Mis Tizadas</Typography>
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
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
       );
   };
   
   export default MisTizadas
   