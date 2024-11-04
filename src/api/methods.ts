import {BASE_API_URL} from '../utils/constants';

import {
    ApiResponse,
    CreateMoldePayload,
    FabricColor,
    FabricPiece,
    Molde,
    Prenda,
    RolloDeTela,
    CreateTizadaFormData,
    TizadaResult
} from '../utils/types';

const useAccessToken = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        return token;
    }
    return null; // Or handle missing token case
};

export const getTizadas = async (userUUID: string | undefined): Promise<ApiResponse<TizadaResult[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/users/${userUUID}/tizadas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return await response.json();
};

export const getTizadaById = async (uuid: string): Promise<ApiResponse<TizadaResult>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/tizada/${uuid}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    return await response.json();
};

export const getMoldes = async (userUUID: string): Promise<ApiResponse<Molde[]>> => {
    console.log('Fetching molds from API...');
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/users/${userUUID}/moldes`,
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

export const createMolde = async (payload: CreateMoldePayload): Promise<ApiResponse<any>> => {

    const token = useAccessToken();
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
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    if (!response.ok) {
      throw new Error('Failed to create mold');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating mold:", error);
    throw error;
  }
};

export const createTizada = async (tizadaData: any): Promise<ApiResponse<CreateTizadaFormData>> => {
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
        return await response.json();
    } catch (error) {
        console.error("Error creating tizada:", error);
        throw error;
    }
};

export const invokeTizada = async (tizadaUUID: string, userUUID: string): Promise<ApiResponse<void>> => {
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
                userUUID,
            }),
        });

        // Handle both 200 and 204 as success cases
        if (response.status === 204) {
            return { status: 'success', data: undefined };
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle 200 case if API changes in future
        const data = await response.json();
        return { status: 'success', data };
    } catch (error) {
        console.error("Error invoking tizada:", error);
        return { status: 'error', data: undefined };
    }
};

export const editTizada = async (uuid: string, name:string): Promise<ApiResponse<void>> => {
    try {
        const token = useAccessToken();
        const url = new URL(`${BASE_API_URL}/tizada/${uuid}`);
        const response = await fetch(url.toString(), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { status: "OK", data: undefined };
    } catch (error) {
        console.error(`Error al editar tizada ${uuid}:`, error);
        return { status: "ERROR", data: undefined };
    }
};

export const deleteTizada = async (uuid: string): Promise<ApiResponse<void>> => {
  try {
      const token = useAccessToken();
      const url = new URL(`${BASE_API_URL}/tizada/${uuid}`);
      url.searchParams.append('id', uuid);

      const response = await fetch(url.toString(), {
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
    
    return { status: "success", data: undefined };
  } catch (error) {
    console.error("Error deleting tizadas:", error);
    return { status: "ERROR", data: undefined };
  }
};

export const getRollos = async (): Promise<ApiResponse<RolloDeTela[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/inventario/rollo`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }); 
        console.log("Rollos: ", response);
    return await response.json();
};

export const getFabrics = async (): Promise<ApiResponse<FabricPiece[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/inventario/fabricPiece`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Fabric: ", response);
    return await response.json();
};

export const getPrendas = async (): Promise<ApiResponse<Prenda[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/inventario/prenda`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }); 
        console.log("Prendas: ", response);
    return await response.json();
};

export const getFabricColors = async (): Promise<ApiResponse<FabricColor[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/inventario/color`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return await response.json();
}

export const createRollo = async (rolloData: any): Promise<ApiResponse<any>> => {
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/inventario/rollo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/inventario/prenda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/inventario/rollo/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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

{/*
export const getTizadasFinalizadas = async (): Promise<ApiResponse<Tizada[]>> => {
    const token = useAccessToken();
    const response = await fetch(`${BASE_API_URL}/tizada?finalizadas=true`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await response.json();
};*/}

export const convertPrenda = async (convertPrendaData: any): Promise<ApiResponse<any>> => {
    try {
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/inventario/fabricPiece/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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

export const editMolde = async (uuid: string, field:'name' | 'description', value: string): Promise<ApiResponse<void>> => {
    try {
        const token = useAccessToken();
        const url = new URL(`${BASE_API_URL}/molde/${uuid}`);
        const response = await fetch(url.toString(), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ [field]: value }), // This will be { name: value } or { description: value }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { status: "OK", data: undefined };
    } catch (error) {
        console.error(`Error updating molde ${uuid}:`, error);
        return { status: "ERROR", data: undefined };
    }
};


export const deleteMolde = async (uuid: string): Promise<ApiResponse<void>> => {
    try {
        const token = useAccessToken();
        const url = new URL(`${BASE_API_URL}/molde/${uuid}`);

        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { status: "OK", data: undefined };
    } catch (error) {
        console.error(`Error deleting molde ${uuid}:`, error);
        return { status: "ERROR", data: undefined };
    }
};

export const deleteMoldes = async (uuids: string[]): Promise<ApiResponse<void>> => {
    try {
        const results = await Promise.all(uuids.map(uuid => deleteMolde(uuid)));
        const hasError = results.some(result => result.status === "ERROR");

        if (hasError) {
            return { status: "ERROR", data: undefined };
        }

        return { status: "success", data: undefined };
    } catch (error) {
        console.error("Error deleting moldes:", error);
        return { status: "ERROR", data: undefined };
    }
};

export const getUserInfo = async () => {
    try{
        const token = useAccessToken();
        const response = await fetch(`${BASE_API_URL}/users/info`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return await response.json();
    }catch (error){
        console.error("Error deleting moldes:", error);
        return { status: "ERROR", data: undefined };
    }
}


export const downloadFile = async (url: string | null) => {
    try {
        const response = await fetch(url || "", {
            method: "GET",
            headers: {
                "Content-Type": "application/octet-stream",
            }
        });
        if (!response.ok) {
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "tizada.svg"); // Customize filename here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL to avoid memory leaks
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Download failed:", error);
    }
};


export const downloadTizadaSvg = async (url: string, fileName: string) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'image/svg+xml',  // Specify we want SVG
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob from response
        const blob = await response.blob();
        
        // Create object URL from blob
        const objectUrl = window.URL.createObjectURL(blob);
        
        // Create temporary link element
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = `${fileName}.svg`; // Set suggested filename
        
        // Add to document, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(objectUrl);
        
        return true;
    } catch (error) {
        console.error('Download failed:', error);
        throw error;
    }
};