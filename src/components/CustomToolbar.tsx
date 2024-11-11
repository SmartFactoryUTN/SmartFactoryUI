import { GridToolbarContainer, GridToolbarProps, useGridApiContext } from '@mui/x-data-grid';
import { Button, Tooltip, Box, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

export type ToolbarAction = 'delete' | 'download';

interface CustomToolbarProps extends GridToolbarProps {
  actions?: ToolbarAction[];
  tooltipText?: string;
  onDelete?: (selectedIds: string[]) => void;
  onDownload?: (selectedIds: string[]) => void;
}

function CustomToolbar(props: CustomToolbarProps) {
  const { 
    actions = [], 
    tooltipText = "Seleccione uno o varios elementos",
    onDelete, 
    onDownload, 
    ...other 
  } = props;
  
  const apiRef = useGridApiContext();
  const hasSelections = apiRef.current.getSelectedRows().size > 0;

  const handleAction = (action: ToolbarAction) => () => {
    const selectedRows = apiRef.current.getSelectedRows();
    const selectedIds = Array.from(selectedRows.keys()) as string[];

    switch (action) {
      case 'delete':
        onDelete?.(selectedIds);
        break;
      case 'download':
        onDownload?.(selectedIds);
        break;
    }
  };

  const actionButtons = {
    delete: (
      <Button
        key="delete"
        startIcon={<DeleteIcon />}
        onClick={handleAction('delete')}
        disabled={!hasSelections}
      >
        Eliminar
      </Button>
    ),
    download: (
      <Button
        key="download"
        startIcon={<DownloadIcon />}
        onClick={handleAction('download')}
        disabled={!hasSelections}
      >
        Descargar
      </Button>
    )
  };

  // Wrap the buttons in Tooltip only if nothing is selected
  const content = (
    <Box>
      {actions.map(action => actionButtons[action])}
    </Box>
  );

  return (
    <GridToolbarContainer {...other}>
      {hasSelections ? content : (
        <Tooltip title={tooltipText} placement="left">
          {content}
        </Tooltip>
      )}
    </GridToolbarContainer>
  );
}

export default CustomToolbar;