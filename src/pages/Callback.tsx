import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";

const Callback = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const storeToken = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    localStorage.setItem('access_token', token); // Store token in localStorage
                    console.log('Access token stored in localStorage');
                } catch (error) {
                    console.error("Error getting access token: ", error);
                }
            }
        };

        storeToken();
    }, [isAuthenticated, getAccessTokenSilently]);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return <div>Redirecting...</div>; // Optionally, redirect to another page after storing the token
};



export default Callback;
