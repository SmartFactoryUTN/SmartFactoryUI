export const REACT_APP_API_SERVER_URL: string = /*import.meta.env.VITE_API_SERVER_URL ||*/ 'https://smartfactoryapi.sa-east-1.elasticbeanstalk.com/api'
export const REACT_APP_AUTH0_DOMAIN: string = import.meta.env.VITE_AUTH0_DOMAIN || 'https://dev-palh3gsscosfpppk.us.auth0.com'
export const REACT_APP_AUTH0_CLIENT_ID: string = import.meta.env.VITE_AUTH0_CLIENT_ID || 'u9EbOfCWWYTDarJN8VxblpBFabtANScD'
export const REACT_APP_AUTH0_CALLBACK_URL: string = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'https://smartfactoryar.netlify.app/callback'
export const REACT_APP_AUTH0_AUDIENCE: string= import.meta.env.VITE_AUTH0_AUDIENCE || 'https://smartfactory-api/'
export const REACT_APP_AUTH0_SCOPES: string= import.meta.env.VITE_AUTH0_SCOPES || 'read:tizada read:molde create:tizada create:molde'
export const BASE_API_URL: string = import.meta.env.BASE_API_URL || REACT_APP_API_SERVER_URL;
export const TEST_USER_ID = '14bd6578-0436-420d-9c64-2beda866fcf0';
