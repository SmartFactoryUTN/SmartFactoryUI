import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CrearTizada from './pages/CrearTizada.tsx'; 
import MisTizadas from './pages/MisTizadas'; 
import VerTizada from './pages/VerTizada'; 
import MisMoldes from './pages/MisMoldes'; 
import SubirMolde from './pages/SubirMolde'; 
import Tutorial from './pages/Tutorial'; 
import Inventario from './pages/Inventario'; 

import Navigation from './components/AppBar';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <Router>
      <div className="App">
      <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/tizadas" replace />} /> // Redirect "/" to "/tizadas"
          <Route path="/tizadas" element={<MisTizadas/>} />
          <Route path="/tizadas/crear" element={<CrearTizada />} />
          <Route path="/tizadas/tizada/:uuid" element={<VerTizada />} />
          <Route path="/moldes" element={<MisMoldes />} />
          <Route path="/moldes/subir" element={<SubirMolde />} /> 
          <Route path="/moldes/crear" element={<Tutorial />} /> 
          <Route path="/inventario" element={<Inventario />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
