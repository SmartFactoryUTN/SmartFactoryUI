import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
interface ConfigProps {
    name: string;
    width: number;
    height: number;
    // Add other configuration properties here
  }
  
  function VerTizada() {
      const navigate = useNavigate();
      const { id } = useParams<{ id: string }>();
      const [loading, setLoading] = useState(true);
      const [config, setConfig] = useState<ConfigProps | null>(null);
      const [svgContent, setSvgContent] = useState<string>('');
  
      useEffect(() => {
          // Simulating API call to fetch tizada data
          const fetchTizadaData = async () => {
              setLoading(true);
              try {
                  // Replace this with your actual API call
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setConfig({
                      name: `Tizada ${id}`,
                      width: 500,
                      height: 500,
                      // Add other configuration properties here
                  });
                  setSvgContent(`
                      <svg width="100%" height="100%" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f0f0f0" />
                          <circle cx="250" cy="250" r="200" fill="blue" />
                          <text x="250" y="250" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Tizada ${id || 'undefined'}</text>
                      </svg>
                  `);
                  setLoading(false);
              } catch (error) {
                  console.error('Error fetching tizada data:', error);
                  setLoading(false);
              }
          };
  
          fetchTizadaData();
      }, [id]);
  
      const columns: GridColDef[] = [
          { field: 'property', headerName: 'Propiedad', width: 150 },
          { field: 'value', headerName: 'Valor', width: 150 },
      ];
  
      const rows = config
          ? Object.entries(config).map(([key, value], index) => ({
                id: index,
                property: key,
                value: value.toString(),
            }))
          : [];
  
      if (loading) {
          return (
              <Container>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                      <CircularProgress />
                      <Typography variant="h6" sx={{ mt: 2 }}>Cargando Tizada...</Typography>
                  </Box>
              </Container>
          );
      }
  
      return (
          <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', flexDirection: 'column'}}>
              <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  {/* Main content area with SVG */}
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                      <div dangerouslySetInnerHTML={{ __html: svgContent }} style={{ width: '100%', height: '100%' }} />
                  </Box>
                  
                  {/* Right sidebar with information */}
                  <Box sx={{ width: 300, borderLeft: '1px solid #ccc', p: 2, overflowY: 'auto' }}>
                      <Typography variant="h6" gutterBottom>Configuración</Typography>
                      <DataGrid
                          rows={rows}
                          columns={columns}
                          hideFooter={true}
                          disableColumnMenu
                          autoHeight
                          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      />
                  </Box>
              </Box>
              
              {/* Footer with back button */}
              <Box sx={{ p: 2, borderTop: '1px solid #ccc', textAlign: 'center' }}>
                  <Button variant="contained" color="primary" onClick={() => navigate('/tizadas')}>
                      Volver a Mis Tizadas
                  </Button>
              </Box>
          </Box>
      );
  }
  
  export default VerTizada;
