export const REACT_APP_API_SERVER_URL: string = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:8080/api'
export const REACT_APP_AUTH0_DOMAIN: string = process.env.REACT_APP_AUTH0_DOMAIN || 'https://dummy.com'
export const REACT_APP_AUTH0_CLIENT_ID: string = process.env.REACT_APP_AUTH0_CLIENT_ID || 'dummy'
export const REACT_APP_AUTH0_CALLBACK_URL: string = process.env.REACT_APP_AUTH0_CALLBACK_URL || 'http://dummy.com'
export const REACT_APP_AUTH0_AUDIENCE: string= process.env.REACT_APP_AUTH0_AUDIENCE || 'https://smartfactory-api/'
export const REACT_APP_AUTH0_SCOPES: string= process.env.REACT_APP_AUTH0_SCOPES || 'read:tizada read:molde create:tizada create:molde'
export const BASE_API_URL: string = process.env.BASE_API_URL || REACT_APP_API_SERVER_URL;
export const TEST_USER_ID = '';
