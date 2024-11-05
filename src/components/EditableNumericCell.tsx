import { useState, useEffect, KeyboardEvent } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
  onSave: (id: string) => void;  
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
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      onSave(row.uuid);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleIncrement = () => {
    const newValue = inputValue + 1;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    if (inputValue > min) {
      const newValue = inputValue - 1;
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        gap: 0.5,
        minWidth: '200px' // Ensure minimum width
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1,
          minWidth: 0 // Allow flex shrinking
        }}>
          <IconButton 
            size="small" 
            onClick={handleDecrement}
            sx={{ padding: '4px' }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>

          <TextField
            value={inputValue}
            size="small"
            autoFocus
            fullWidth
            type="number"
            inputProps={{ 
              min,
              style: { 
                textAlign: 'center',
                padding: '4px'
              }
            }}
            onChange={(e) => {
              const newValue = parseInt(e.target.value) || 0;
              if (newValue >= min) {
                setInputValue(newValue);
                onChange(newValue);
              }
            }}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            sx={{
              mx: 1,
              width: '80px', // Fixed width for number input
              '& .MuiOutlinedInput-root': {
                height: '32px'
              }
            }}
          />

          <IconButton 
            size="small" 
            onClick={handleIncrement}
            sx={{ padding: '4px' }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 0.5,
          ml: 1
        }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onSave(row.uuid);
            }}
            sx={{ padding: '4px' }}
          >
            <CheckIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            sx={{ padding: '4px' }}
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
      '& .edit-button': {
        opacity: 0,
        transition: 'opacity 0.2s'
      },
      '&:hover .edit-button': {
        opacity: 1
      }
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      <IconButton
        className="edit-button"
        size="small"
        sx={{ ml: 'auto' }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(row.uuid);
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default EditableNumericCell;