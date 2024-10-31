import { editMolde, editTizada } from '../../api/methods';
import {useState} from 'react';

type EntityType = 'molde' | 'tizada';
type EditableField = 'name' | 'description';

interface EditManagerConfig {
  entityType: EntityType;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const useEditManager = ({ entityType, onSuccess, onError }: EditManagerConfig) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  const startEdit = (id: string, field: EditableField, currentValue: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditedValue(currentValue);
  };

  const saveEdit = async (id: string, field: EditableField) => {
    try {
      let response;

      if (entityType === 'molde') {
        response = await editMolde(id, field, editedValue);
      } else {
        // Tizada only has name field
        response = await editTizada(id, editedValue);
      }

      if (response.status === "OK") {
        setEditingId(null);
        setEditingField(null);
        onSuccess();
      } else {
        onError(`Error al actualizar el campo`);
      }
    } catch (err) {
      onError(`Error al actualizar el campo`);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditedValue('');
  };

  return {
    editingId,
    editingField,
    editedValue,
    startEdit,
    saveEdit,
    cancelEdit,
    setEditedValue
  };
};