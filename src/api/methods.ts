// api/tizadas.ts
import { BASE_API_URL } from '../utils/constants';

export const getTizadas = async () => {
  const response = await fetch(`${BASE_API_URL}/tizada`);
  return await response.json();
};