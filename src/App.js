import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Index from './components/Index';
import Documentos from './components/Documentos';
import Areas from './components/Areas';

import 'primereact/resources/themes/lara-light-blue/theme.css'; // Tema
import 'primereact/resources/primereact.min.css';               // Estilos básicos de PrimeReact
import 'primeicons/primeicons.css';                             // Iconos de PrimeIcons


const Usuarios = () => <h2>Usuarios</h2>;

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogin = (user) => {
        setUser(true);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const handleLogout = () => {
        console.log("ENTRÉ A CERRAR SESION")
        console.log(user)
        setUser(false);
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="App">
                {user ? (
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/documentos" element={<Documentos />} />
                        <Route path="/areas" element={<Areas />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="*" element={<Navigate to="/" />} />
                     
                    </Routes>
                ) : (
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;
