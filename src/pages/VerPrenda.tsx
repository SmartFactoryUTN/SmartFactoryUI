import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, Button, Divider, Link, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getPrendaById } from "../api/methods.ts";
import { Prenda, RolloDeTela } from "../utils/types.tsx";
import PageLayout from "../components/layout/PageLayout";
import {getFontFamily} from "../utils/fonts.tsx";
import SvgPreview from "../components/MoldePreview.tsx";

const DetallePrenda: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();

    const [garment, setGarment] = React.useState<Prenda | null>(null);
    const [fabricRoll, setFabricRoll] = React.useState<RolloDeTela | null>(null);

    // Estado para la previsualización
    const [selectedMolde, setSelectedMolde] = React.useState<{ name: string; url: string } | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchGarmentDetail = async () => {
            try {
                const response = await getPrendaById(uuid!);
                if (response.status === 'success') {
                    setGarment(response.data);
                    setFabricRoll(response.data.fabricPieces[0]?.fabricRoll || null);
                } else {
                    console.error('Failed to fetch garment details');
                }
            } catch (error) {
                console.error('Error fetching garment details:', error);
            }
        };

        fetchGarmentDetail();
    }, [uuid]);

    const handleOpenPreview = (moldeName: string, moldeUrl: string) => {
        setSelectedMolde({ name: moldeName, url: moldeUrl });
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setSelectedMolde(null);
        setIsPreviewOpen(false);
    };

    if (!garment) {
        return (
            <PageLayout>
                <Typography variant="h6">Cargando detalles de la prenda...</Typography>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    width: '100%',
                }}
            >
                {/* Título */}
                <Typography variant="h4" gutterBottom sx={{fontFamily: getFontFamily('bodoni')}}>
                    Detalle de la Prenda
                </Typography>

                {/* Información General */}
                <Card variant="outlined" sx={{ mb: 3, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h6">Información general</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography><strong>Artículo:</strong> {garment.article}</Typography>
                        <Typography><strong>Descripción:</strong> {garment.description}</Typography>
                        <Typography><strong>Stock:</strong> {garment.stock}</Typography>
                    </CardContent>
                </Card>

                {/* Rollo de Tela Asociado */}
                {fabricRoll && (
                    <Card variant="outlined" sx={{ mb: 3, width: '100%' }}>
                        <CardContent>
                            <Typography variant="h6">Detalle del material</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography><strong>Artículo:</strong> {fabricRoll.name}</Typography>
                            <Typography><strong>Descripción:</strong> {fabricRoll.description}</Typography>
                            <Typography><strong>Color:</strong> {fabricRoll.color.name}</Typography>
                            <Typography><strong>Stock:</strong> {fabricRoll.stock}</Typography>
                        </CardContent>
                    </Card>
                )}

                {/* Moldes Asociados */}
                <Card variant="outlined" sx={{ mb: 3, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h6">Moldes que la conforman</Typography>
                        <Divider sx={{ my: 2 }} />
                        {garment.fabricPieces.map((piece, index) => (
                            <React.Fragment key={piece.fabricPieceId}>
                                <Typography><strong>Artículo:</strong> {piece.molde.name}</Typography>
                                <Typography><strong>Descripción:</strong> {piece.molde.description}</Typography>
                                <Typography><strong>Veces que aparece en esta prenda:</strong> {piece.quantity}</Typography>
                                <Typography><strong>Stock:</strong> {piece.stock}</Typography>
                                <Typography>
                                    <strong>
                                        <Link
                                            component="button"
                                            onClick={() => handleOpenPreview(piece.name, piece.url)}
                                            sx={{ color: 'primary.main', textDecoration: 'underline', fontWeight: 'bold' }}
                                        >
                                            Previsualizar
                                        </Link>
                                    </strong>
                                </Typography>
                                {index < garment.fabricPieces.length - 1 && <Divider sx={{ my: 2 }} />}
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>

                {/* Botón de Volver */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                        Volver
                    </Button>
                </Box>
            </Box>

            {/* Dialogo de Previsualización */}
            <Dialog
                open={isPreviewOpen}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
                aria-labelledby="preview-dialog-title"
            >
                <DialogTitle id="preview-dialog-title">
                    Vista Previa del Molde {selectedMolde?.name}
                </DialogTitle>
                <DialogContent>
                    {selectedMolde?.url ? (
                        <SvgPreview url={selectedMolde.url} />
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No hay una previsualización disponible para este molde.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreview}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
};

export default DetallePrenda;
