import { useState, useEffect, KeyboardEvent } from 'react';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/EditNote';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface EditableNumericCellProps {
  value: number;
  row: any;
  field?: string;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: number) => void;
  min?: number;
}

const EditableNumericCell = ({
  value,
  row,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  min = 0
}: EditableNumericCellProps) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [initialValue, setInitialValue] = useState<number>(value);

  useEffect(() => {
    if (isEditing) {
      setInitialValue(value);
      setInputValue(value.toString());
    }
  }, [isEditing, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleIncrement = () => {
    const newValue = parseInt(inputValue || '0') + 1;
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleDecrement = () => {
    const currentValue = parseInt(inputValue || '0');
    if (currentValue > min) {
      const newValue = currentValue - 1;
      setInputValue(newValue.toString());
      onChange(newValue);
    }
  };

  const handleSave = () => {
    // If input is empty or invalid, treat it as a cancel
    if (inputValue.trim() === '' || isNaN(parseInt(inputValue))) {
      handleCancel();
      return;
    }
    
    const numValue = parseInt(inputValue);
    if (numValue >= min) {
      onChange(numValue);
      onSave();
    }
  };

  const handleCancel = () => {
    // Reset to initial value and cancel
    onChange(initialValue);
    onCancel();
  };

  const handleInputChange = (value: string) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
      if (value !== '') {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
          onChange(numValue);
        }
      }
    }
  };

  if (isEditing) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        width: '100%',
        minWidth: 'min-content'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'auto'
        }}>
          <IconButton
            size="small"
            onClick={handleDecrement}
            sx={{
              padding: '2px',
              '& svg': { fontSize: '12px' }
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <TextField
            value={inputValue}
            size="small"
            autoFocus
            sx={{
              mx: 0.5,
              minWidth: '60px',
              maxWidth: '80px',
              '& .MuiOutlinedInput-root': {
                height: '28px'
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
                padding: '4px 8px',
                fontSize: '0.875rem'
              }
            }}
            inputProps={{
              style: { textAlign: 'center' }
            }}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          />

          <IconButton
            size="small"
            onClick={handleIncrement}
            sx={{
              padding: '2px',
              '& svg': { fontSize: '16px' }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{
          display: 'flex',
          gap: 0.25,
          marginLeft: 'auto'
        }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            sx={{
              padding: '2px',
              '& svg': { fontSize: '16px' }
            }}
          >
            <CheckIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            sx={{
              padding: '2px',
              '& svg': { fontSize: '16px' }
            }}
          >
            <CloseIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      <Tooltip title="Editar Stock">
        <IconButton
          className="edit-button"
          size="small"
          sx={{ ml: 'auto' }}
          onClick={(e) => {
            e.stopPropagation();
            const id = row.fabricRollId || row.fabricPieceId || row.garmentId;
            if (id) {
              onEdit(id);
            } else {
              console.error('No valid ID found in row:', row);
            }
          }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EditableNumericCell;