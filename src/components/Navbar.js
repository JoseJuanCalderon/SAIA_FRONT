import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ idRol, onLogout }) => {
    const navigate = useNavigate();

    console.log("idRol en Navbar:", idRol); // Verifica el valor de idRol

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/documentos">Documentos</Link></li>
                {(idRol === 1 || idRol === 2) && (
                    <>
                        <li><Link to="/usuarios">Usuarios</Link></li>
                        <li><Link to="/areas">Areas</Link></li>
                    </>
                )}
                <li>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
