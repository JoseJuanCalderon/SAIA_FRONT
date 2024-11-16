import React, { useState } from 'react';
import { login } from '../services/api';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const Login = ({ onLogin }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const user = await login(correo, contrasena);
            setMessage('Login successful');
            localStorage.setItem('user', JSON.stringify(user));
            onLogin(user);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error de conexión';
            if (errorMessage === 'Credenciales inválidas') {
                setError('El correo o la contraseña son incorrectos.');
            } else {
                setError(errorMessage);
            }
            console.error(error);
        }
    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh', backgroundColor: '#f4f4f4' }}>
            <Card className="p-shadow-5" style={{ width: '30rem' }}>
                <h2 className="p-text-center">Iniciar Sesión</h2>
                <Divider />
                <form onSubmit={handleLogin}>
                    <div className="p-field">
                        <label htmlFor="correo">Correo</label>
                        <InputText
                            id="correo"
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Ingresa tu correo"
                            className="p-inputtext-lg"
                            required
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contrasena">Contraseña</label>
                        <Password
                            id="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            feedback={false}
                            toggleMask
                            required
                        />
                    </div>
                    <Button label="Iniciar Sesión" className="p-button-lg p-button-primary p-mt-3" type="submit" />
                </form>
                {error && (
                    <Message severity="error" text={error} className="p-mt-3" />
                )}
                {message && (
                    <Message severity="success" text={message} className="p-mt-3" />
                )}
            </Card>
        </div>
    );
};

export default Login;
