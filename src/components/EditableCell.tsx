import { useState, useEffect } from 'react';

import { Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface EditableCellProps {
  value: string;
  row: any;
  field: string;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

const EditableCell = ({ 
  value, 
  row, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel,
  onChange 
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <TextField
          value={inputValue}
          size="small"
          autoFocus
          fullWidth
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            onChange(newValue);  // Just pass the new value
          }}
        />
        <Box sx={{ ml: 1 }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onSave(row.uuid);
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

export default EditableCell;