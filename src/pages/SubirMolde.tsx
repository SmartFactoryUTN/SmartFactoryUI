import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Typography, 
    Box, 
    Button, 
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/layout/PageLayout';

const SubirMolde: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedFile(file);
  
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
  
        // Capture SVG content to upload it as a field 
        const svgReader = new FileReader();
        svgReader.onload = (e) => {
          const svgContent = e.target?.result as string;
          console.log('SVG Content:', svgContent);
        };
        svgReader.readAsText(file);
      }
    };
  
    const handleUpload = () => {
      console.log('Uploading file:', selectedFile); // TODO
      navigate('/moldes');
    };

  return (
      <PageLayout>
      <Box sx={{ mt: 4, mb: 4 }}>
        <IconButton onClick={() => navigate('/moldes')} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Subir Nuevo Molde
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            border: '2px dashed grey',
            borderRadius: 2,
            p: 2,
          }}
        >
          {preview ? (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Box>
          ) : (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Seleccionar Archivo
                </Button>
              </label>
            </>
          )}
        </Box>
        {selectedFile && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
            >
              Subir Molde
            </Button>
          </Box>
        )}
      </Box>
      </PageLayout>
  );
};

export default SubirMolde;