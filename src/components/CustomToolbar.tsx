import { GridToolbarContainer, useGridApiContext, GridToolbarProps } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

interface CustomToolbarProps extends GridToolbarProps {
  onDelete?: (selectedIds: string[]) => void;
}

function CustomToolbar(props: CustomToolbarProps) {
  const { onDelete, ...other } = props;
  const apiRef = useGridApiContext();
  
  const handleDelete = () => {
    if (onDelete) {
      const selectedRows = apiRef.current.getSelectedRows();
      const selectedIds = Array.from(selectedRows.keys()) as string[];
      onDelete(selectedIds);
    }
  };

  return (
    <GridToolbarContainer {...other}>
      <Button
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={apiRef.current.getSelectedRows().size === 0}
      >
        Eliminar
      </Button>
    </GridToolbarContainer>
  );
}

export default CustomToolbar;