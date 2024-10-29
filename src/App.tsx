import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import React from "react";
import './App.css';
import CrearTizada from './pages/CrearTizada';
import MisTizadas from './pages/MisTizadas';
import VerTizada from './pages/VerTizada';
import MisMoldes from './pages/MisMoldes';
import SubirMolde from './pages/SubirMolde';
import Tutorial from './pages/Tutorial';
import Inventario from './pages/Inventario';
import Callback from "./pages/Callback";
import CrearPrenda from "./pages/CrearPrenda";
import Login from "./pages/Login";
import Navigation from './components/AppBar';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {useAuth0} from "@auth0/auth0-react";
import {UserProvider} from "./components/Login/UserProvider.tsx";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    const { isAuthenticated } = useAuth0();

    return (
        <Router>
            <UserProvider>
                <div className="App">
                    <Navigation isAuthenticated={isAuthenticated}/>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/callback" element={<Callback/>} />

                        {/* Private routes */}
                        <Route path="/tizadas" element={
                            <PrivateRoute>
                                <MisTizadas/>
                            </PrivateRoute>
                        }/>
                        <Route path="/tizadas/crear" element={
                            <PrivateRoute>
                                <CrearTizada/>
                            </PrivateRoute>
                        }/>
                        <Route path="/tizadas/tizada/:uuid" element={
                            <PrivateRoute>
                                <VerTizada/>
                            </PrivateRoute>
                        }/>
                        <Route path="/moldes" element={
                            <PrivateRoute>
                                <MisMoldes/>
                            </PrivateRoute>
                        }/>
                        <Route path="/moldes/subir" element={
                            <PrivateRoute>
                                <SubirMolde/>
                            </PrivateRoute>
                        }/>
                        <Route path="/moldes/crear" element={
                            <PrivateRoute>
                                <Tutorial />
                            </PrivateRoute>
                        }/>
                        <Route path="/inventario" element={
                            <PrivateRoute>
                                <Inventario />
                            </PrivateRoute>
                        }/>
                        <Route path="/inventario/prenda/crear" element={
                            <PrivateRoute>
                                <CrearPrenda />
                            </PrivateRoute>
                        }/>

                        {/* Redirect root to appropriate page based on auth status */}
                        <Route path="/" element={
                            isAuthenticated ? 
                                <Navigate to="/tizadas" replace /> : 
                                <Navigate to="/login" replace />
                        }/>
                    </Routes>
                </div>
            </UserProvider>
        </Router>
    );
}

export default App;