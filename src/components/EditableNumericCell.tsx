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
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      onSave();
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
            type="number"
            sx={{
              mx: 0.5, // Reduced margin
              minWidth: '60px', // Base width for ~5 characters
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
                padding: '4px 8px', // Reduced padding
                fontSize: '0.875rem' // Slightly smaller font
              }
            }}
            inputProps={{ 
              min,
              style: { 
                textAlign: 'center'
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
          />

          <IconButton 
            size="small" 
            onClick={handleIncrement}
            sx={{
              padding: '2px', // Reduced padding
              '& svg': { fontSize: '16px' } // Smaller icon
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ 
          display: 'flex',
          gap: 0.25, // Reduced gap
          marginLeft: 'auto'
        }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onSave(); 
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
              onCancel();
            }}
            sx={{
              padding: '2px', // Reduced padding
              '& svg': { fontSize: '16px' } // Smaller icon
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
          console.log('Edit clicked:', { row, id }); // Debug log
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