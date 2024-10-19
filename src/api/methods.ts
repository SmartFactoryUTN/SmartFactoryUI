import {BASE_API_URL} from '../utils/constants';
import {ApiResponse, Molde, Tizada} from '../utils/types';

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
