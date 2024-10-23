import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Auth0Provider} from "@auth0/auth0-react";
import {
    REACT_APP_AUTH0_AUDIENCE,
    REACT_APP_AUTH0_CALLBACK_URL,
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_SCOPES
} from "./utils/constants.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Auth0Provider
          domain={REACT_APP_AUTH0_DOMAIN}
          clientId={REACT_APP_AUTH0_CLIENT_ID}
          authorizationParams={{
              redirect_uri: REACT_APP_AUTH0_CALLBACK_URL,
              audience: REACT_APP_AUTH0_AUDIENCE,
              scope: REACT_APP_AUTH0_SCOPES
          }}
      >
        <App />
      </Auth0Provider>
  </React.StrictMode>,
)
