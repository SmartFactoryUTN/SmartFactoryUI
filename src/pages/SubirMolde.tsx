import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createMolde} from '../api/methods';
import {Alert, Box, Button, IconButton, Snackbar, TextField, Typography,} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageLayout from '../components/layout/PageLayout';
import {useUserContext} from "../components/Login/UserProvider.tsx";


const SubirMolde: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { userData } = useUserContext();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedFile(file);
  
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleUpload = async () => {
      if (!selectedFile || !name || !description) {
        setError('Por favor, complete todos los campos y seleccione un archivo.');
        return;
      }

      try {
        const response = await createMolde({
          name,
          description,
          // @ts-expect-error "skipped"
          userUUID: userData?.id,
          file: selectedFile,
        });

        if (response.status === 'success') {
          setSuccess(true);
          setTimeout(() => navigate('/moldes'), 2000);
        } else {
          throw new Error('Failed to create mold');
        }
      } catch (err) {
        setError('Ocurrió un error al subir el molde. Por favor, intente nuevamente.');
      }
    };

  return (
      <PageLayout>
        {/* Title and Button */}
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={() => navigate('/moldes')} sx={{ mr: 2, mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Subir Nuevo Molde
        </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Nombre del Molde"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </Box>
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
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            Hubo un error al crear tu molde
          </Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Nuevo molde cargado!
        </Alert>
      </Snackbar>
      </PageLayout>
  );
};

export default SubirMolde;
