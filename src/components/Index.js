import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import bienvenidaImg from '../static/Logo.png';

const Index = () => {
    const navigate = useNavigate();

    const items = [
        { label: 'Documentos', icon: 'pi pi-file', command: () => navigate('/documentos') },
        { label: 'Áreas', icon: 'pi pi-th-large', command: () => navigate('/areas') },
        { label: 'Usuarios', icon: 'pi pi-users', command: () => navigate('/usuarios') },
    ];

    const cerrarS=()=>{
        console.log("CERRÉ SESIÓN")
        localStorage.removeItem('user')
        window.location.href = '/login';

    }

    const start = <h2>SAIA</h2>;
    const end = <button className="p-button p-component" onClick={() => cerrarS()}>Cerrar Sesión</button>;

    return (
        <div>
            <Menubar model={items} start={start} end={end} />
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Bienvenido al sistema SAIA</h1>
                <p>Seleccione una opción del menú para continuar.</p>
                <img
                src={bienvenidaImg}
                alt="Bienvenido al sistema SAIA"
                style={{ marginTop: '1rem', maxWidth: '100%', height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default Index;
