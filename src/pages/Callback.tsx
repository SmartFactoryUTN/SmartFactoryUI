import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Callback() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const storeAccessToken = async () => {
            if (isAuthenticated) {
                try {
                    const accessToken = await getAccessTokenSilently();
                    localStorage.setItem("access_token", accessToken);
                    navigate("/tizadas"); // Redirect to MisTizadas
                } catch (error) {
                    console.error("Error fetching access token", error);
                }
            }
        };
        storeAccessToken();
    }, [isAuthenticated, getAccessTokenSilently, navigate]);

    return <div>Loading...</div>; // Optionally display a loading message while redirecting
}




export default Callback;
