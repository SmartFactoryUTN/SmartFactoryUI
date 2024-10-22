import {useAuth0} from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();


    return (
        <button onClick={
            () => {
                const token = localStorage.getItem('access_token');
                localStorage.removeItem('access_token');
                console.log("Delete token", token);
                logout({logoutParams: {returnTo: window.location.origin}})
            }
        }>
            Log Out
        </button>
    );
};

export default LogoutButton;
