import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import React from "react";
import './App.css';
import CrearTizada from './pages/CrearTizada.tsx';
import MisTizadas from './pages/MisTizadas';
import VerTizada from './pages/VerTizada';
import MisMoldes from './pages/MisMoldes';
import SubirMolde from './pages/SubirMolde';
import Tutorial from './pages/Tutorial';
import Inventario from './pages/Inventario';
import Callback from "./pages/Callback";

import Navigation from './components/AppBar';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "./components/Login/LoginButton.tsx";

function App() {

    const {isAuthenticated} = useAuth0();

    return (
        <Router>
            <div className="App">
                <Navigation isAuthenticated={isAuthenticated}/>
                <Routes>
                    <Route path="/" element={<Navigate to="/tizadas" replace/>}/> // Redirect "/" to "/tizadas"
                    <Route path="/login" element={<LoginButton>LOGIN</LoginButton>}/>
                    {isAuthenticated &&
                        (
                            <React.Fragment>
                                <Route path="/tizadas" element={<MisTizadas/>}/>
                                <Route path="/tizadas/crear" element={<CrearTizada/>}/>
                                <Route path="/tizadas/tizada/:uuid" element={<VerTizada/>}/>
                                <Route path="/moldes" element={<MisMoldes/>}/>
                                <Route path="/moldes/subir" element={<SubirMolde/>}/>
                                <Route path="/moldes/crear" element={<Tutorial />} />
                                <Route path="/inventario" element={<Inventario />} />
                                <Route path="/callback" element={<Callback/>}/>
                            </React.Fragment>
                        )
                    }
                </Routes>
            </div>
        </Router>
    );
}

export default App;
