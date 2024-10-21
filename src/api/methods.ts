import {BASE_API_URL} from '../utils/constants';

import { ApiResponse, FabricColor, FabricPiece, Molde, Prenda, RolloDeTela, Tizada, CreateMoldePayload } from '../utils/types';

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

export const createMolde = async (payload: CreateMoldePayload): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams({
    name: payload.name,
    description: payload.description,
    userUUID: payload.userUUID
  });

  const url = `${BASE_API_URL}/molde/create?${queryParams.toString()}`;

  try {
    const formData = new FormData();
    formData.append('svg', payload.file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create mold');
    }

    const data: ApiResponse<any> = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating mold:", error);
    throw error;
  }
};

export const createTizada = async (tizadaData: any): Promise<ApiResponse<Tizada>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/tizada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export const invokeTizada = async (tizadaUUID: string, userUUID: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/tizada/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tizadaUUID,
        userUUID,
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
    const url = new URL(`${BASE_API_URL}/tizada/${uuid}`);
    url.searchParams.append('id', uuid);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
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
    
    return { status: "success", data: undefined };
  } catch (error) {
    console.error("Error deleting tizadas:", error);
    return { status: "ERROR", data: undefined };
  }
};

export const getRollos = async (): Promise<ApiResponse<RolloDeTela[]>> => {
  const response = await fetch(`${BASE_API_URL}/inventario/rollo`); //TODO : ajustar el url del endpoint
  return await response.json();
};

export const getFabrics = async (): Promise<ApiResponse<FabricPiece[]>> => {
  const response = await fetch(`${BASE_API_URL}/inventario/fabricPiece`); //TODO : ajustar el url del endpoint
  return await response.json();
};

export const getPrendas = async (): Promise<ApiResponse<Prenda[]>> => {
  const response = await fetch(`${BASE_API_URL}/inventario/prenda`); //TODO : ajustar el url del endpoint
  return await response.json();
};

export const getFabricColors = async (): Promise<ApiResponse<FabricColor[]>> => {
  const response = await fetch(`${BASE_API_URL}/inventario/color`);
  return await response.json();
}

export const createRollo = async (rolloData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/inventario/rollo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rolloData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating roll:", error);
    throw error;
  }
};

export const createPrenda = async (prendaData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/inventario/prenda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prendaData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating garmnet:", error);
    throw error;
  }
};

export const convertRollos = async (convertRollosData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/inventario/rollo/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertRollosData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error converting rolls:", error);
    throw error;
  }
}

export const getTizadasFinalizadas = async (): Promise<ApiResponse<Tizada[]>> => {
  const response = await fetch(`${BASE_API_URL}/tizada?finalizadas=true`);
  return await response.json();
};

export const convertPrenda = async (convertPrendaData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_API_URL}/inventario/fabricPiece/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertPrendaData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error converting roll:", error);
    throw error;
  }
}