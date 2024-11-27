import { GridToolbarContainer, GridToolbarProps, useGridApiContext } from '@mui/x-data-grid';
import { Button, Tooltip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import GestureIcon from '@mui/icons-material/Gesture';

export type ToolbarAction = 'delete' | 'download' | 'cut' | 'sew';

interface CustomToolbarProps extends Omit<GridToolbarProps, 'onCut' | 'onSew'> {
  actions?: ToolbarAction[];
  tooltipText?: string;
  onDelete?: (selectedIds: string[]) => void;
  onDownload?: (selectedIds: string[]) => void;
  onCut?: (selectedIds: string[]) => void;
  onSew?: (selectedIds: string[]) => void;
}

function CustomToolbar(props: CustomToolbarProps) {
  const {
    actions = [],
    tooltipText = "Seleccione uno o varios elementos",
    onDelete,
    onDownload,
    onCut,
    onSew,
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
      case 'cut':
        onCut?.(selectedIds);
        break;
      case 'sew':
        onSew?.(selectedIds);
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
    ),
    cut: (
      <Button
        key="cut"
        startIcon={<ContentCutIcon />}
        onClick={handleAction('cut')}
        disabled={!hasSelections}
      >
        Cortar telas
      </Button>
    ),
    sew: (
      <Button
        key="sew"
        startIcon={<GestureIcon />}
        onClick={handleAction('sew')}
        disabled={!hasSelections}
      >
        Coser Prenda
      </Button>
    )
  };

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