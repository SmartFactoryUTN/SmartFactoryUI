import {editMolde, editTizada, updatePrenda, updateRollo} from '../../api/methods';
import {useState} from 'react';

type EntityType = 'molde' | 'tizada' | 'rollo' | 'prenda';
type EditableField = 'name' | 'description' | 'article';

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

      if (entityType === 'molde' && (field === 'name' || field === 'description')) {
        response = await editMolde(id, field, editedValue);
      } else if (entityType === 'tizada' && field === 'name') {
        response = await editTizada(id, editedValue);
      } else if (entityType === 'rollo' && (field === 'name' || field === 'description')) {
        const payload = { [field]: editedValue };
        response = await updateRollo(id, payload);
      } else if (entityType === 'prenda' && (field === 'article' || field === 'description')) {
        const payload = { [field]: editedValue };
        response = await updatePrenda(id, payload);
      } else {
        throw new Error(`El campo ${field} no es válido para la entidad ${entityType}`);
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