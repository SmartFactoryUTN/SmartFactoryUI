import {BASE_API_URL} from '../utils/constants';
import { ApiResponse, Tizada, Molde, RolloDeTela, FabricPiece, Prenda } from '../utils/types';

const useAccessToken = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        return token;
    }
    return null; // Or handle missing token case
};

export const getTizadas = async (): Promise<ApiResponse<Tizada[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/tizada`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return await response.json();
};

export const getTizadaById = async (uuid: string): Promise<ApiResponse<Tizada>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/tizada/${uuid}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return await response.json();
};

export const getMoldes = async (): Promise<ApiResponse<Molde[]>> => {
    console.log('Fetching molds from API...');
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/molde`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse<Molde[]> = await response.json();
        console.log('Moldess fetched:', data);
        return data;
    } catch (error) {
        console.error("Error fetching molds:", error);
        throw error;
    }
};

export const createTizada = async (tizadaData: any): Promise<ApiResponse<Tizada>> => {
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/tizada`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(tizadaData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse<Tizada> = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating tizada:", error);
        throw error;
    }
};

export const invokeTizada = async (tizadaUUID: string, user: string): Promise<ApiResponse<any>> => {
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/tizada/invoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                tizadaUUID,
                user,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<any> = await response.json();
        return data;
    } catch (error) {
        console.error("Error invoking tizada:", error);
        throw error;
    }
};

export const deleteTizada = async (uuid: string): Promise<ApiResponse<void>> => {
  try {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/tizada/${uuid}`, {
      method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { status: "OK", data: undefined };
  } catch (error) {
    console.error(`Error deleting tizada ${uuid}:`, error);
    return { status: "ERROR", data: undefined };
  }
};

export const deleteTizadas = async (uuids: string[]): Promise<ApiResponse<void>> => {
  try {
    const results = await Promise.all(uuids.map(uuid => deleteTizada(uuid)));
    const hasError = results.some(result => result.status === "ERROR");

    if (hasError) {
      return { status: "ERROR", data: undefined };
    }

    return { status: "OK", data: undefined };
  } catch (error) {
    console.error("Error deleting tizadas:", error);
    return { status: "ERROR", data: undefined };
  }
};

export const getRollos = async (): Promise<ApiResponse<RolloDeTela[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/rollos`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }); //TODO : ajustar el url del endpoint
    return await response.json();
};

export const getFabrics = async (): Promise<ApiResponse<FabricPiece[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/fabricPiece`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }); //TODO : ajustar el url del endpoint
    return await response.json();
};

export const getPrendas = async (): Promise<ApiResponse<Prenda[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/prendas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }); //TODO : ajustar el url del endpoint
    return await response.json();
};
