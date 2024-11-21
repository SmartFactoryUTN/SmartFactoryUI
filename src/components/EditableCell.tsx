import { useState, useEffect, KeyboardEvent } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface EditableCellProps {
  value: string;
  row: any;
  field: string;
  idField: string;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onChange: (value: string) => void;
}

const EditableCell = ({
  value,
  row,
  idField,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [initialValue, setInitialValue] = useState(value);

  useEffect(() => {
    if (isEditing) {
      setInitialValue(value);
      setInputValue(value);
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

  const handleSave = () => {
    // If input is empty or only whitespace, treat it as a cancel
    if (!inputValue || !inputValue.trim()) {
      handleCancel();
      return;
    }
    onSave(row[idField]);
  };

  const handleCancel = () => {
    // Reset to initial value and cancel
    onChange(initialValue);
    onCancel();
  };

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
            onChange(newValue);
          }}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          InputProps={{
            sx: {
              padding: '0px',
              '& input': {
                padding: '8px'
              }
            }
          }}
        />
        <Box sx={{ ml: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
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
          onEdit(row[idField]);
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default EditableCell;