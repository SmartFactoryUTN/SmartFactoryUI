import { BASE_API_URL } from '../utils/constants';
import { ApiResponse, Tizada, Molde } from '../utils/types';

export const getTizadas = async (): Promise<ApiResponse<Tizada[]>> => {
  const response = await fetch(`${BASE_API_URL}/tizada`);
  return await response.json();
};

export const getTizadaById = async (uuid: string): Promise<ApiResponse<Tizada>> => {
  const response = await fetch(`${BASE_API_URL}/tizada/${uuid}`);
  return await response.json();
};

export const getMoldes = async (): Promise<ApiResponse<Molde[]>> => {
  console.log('Fetching molds from API...');  
  try {
      const response = await fetch(`${BASE_API_URL}/molde`);
      if (!response.ok) {
        console.log('OK! Response: ');
        console.log(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ApiResponse<Molde[]> = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching molds:", error);
      throw error;
    }
  };
