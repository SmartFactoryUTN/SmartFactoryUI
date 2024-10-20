import {useNavigate} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, TextField} from "@mui/material";
import {getFabricColors} from "../api/methods.ts";
import {FabricColor} from "../utils/types.tsx";
import {columnsStateInitializer} from "@mui/x-data-grid/internals";

interface NuevoRolloForm {
    name: string;
    color: string;
}

const NuevoRolloModal = ({open, onClose, onSave}) => {
    const [colors, setColors] = useState<FabricColor[]>([]);

    useEffect(() => {
        fetchColors();
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchColors = useCallback(async () => {
        if (isLoading) return
        setIsLoading(true);
        try {
            const result = await getFabricColors()
            if (result.status === 'success') {
                setColors(result.data);
            } else {
                console.error('Failed to fetch colors:', result.data.message)
                setError('Failed to fetch colors. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching colors:', error);
        } finally {
            setIsLoading(false);
        }
    })

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Nuevo Rollo</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="Nombre del Rollo" fullWidth variant="outlined" />
                <Select
                    ></Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onSave}>Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NuevoRolloModal;