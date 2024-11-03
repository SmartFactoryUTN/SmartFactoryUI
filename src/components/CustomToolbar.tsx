import {GridToolbarContainer, GridToolbarProps, useGridApiContext} from '@mui/x-data-grid';
import {Button, Tooltip, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

interface CustomToolbarProps extends GridToolbarProps {
  onDelete?: (selectedIds: string[]) => void;
  onDownload?: (selectedIds: string[]) => void;
}

function CustomToolbar(props: CustomToolbarProps) {
  const { onDelete, onDownload, ...other } = props;
  
  const apiRef = useGridApiContext();
  const help = "Seleccione una o varias tizadas";

  const handleDelete = () => {
    if (onDelete) {
      const selectedRows = apiRef.current.getSelectedRows();
      const selectedIds = Array.from(selectedRows.keys()) as string[];
      onDelete(selectedIds);
    }
  };
  const handleDownload = () => {
    if (onDownload) {
      const selectedRows = apiRef.current.getSelectedRows();
      const selectedIds = Array.from(selectedRows.keys()) as string[];
      onDownload(selectedIds);
    }
  };

  return (
    <GridToolbarContainer {...other}>
      <Tooltip title={help} placement="left">
      <Box>      
      <Button
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={apiRef.current.getSelectedRows().size === 0}
      >
        Eliminar
      </Button>
      <Button
        startIcon={<DownloadIcon />}
        onClick={handleDownload}
        disabled={apiRef.current.getSelectedRows().size === 0}
      >
        Descargar
      </Button>
      </Box>
      </Tooltip>
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
