import React from 'react';
import './NavBar.css'; // Import the CSS file for styling

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
        <div className="navbar-brand">
            SmartFactory
            </div>
            <div className="navbar-buttons">
    <button className="nav-button">Tizada</button>
        <button className="nav-button">Escaneo de Moldes</button>
        <button className="nav-button">Inventario</button>
        </div>
        </nav>
);
};

export default NavBar;
