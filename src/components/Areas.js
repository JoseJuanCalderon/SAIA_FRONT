import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

const Areas = () => {
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [newArea, setNewArea] = useState({ clave: '', nombre: '' });
    const toast = useRef(null);

    // Cargar áreas desde la API
    const fetchAreas = async () => {
        try {
            const response = await fetch('https://saia-api.onrender.com/areas');
            const data = await response.json();
            setAreas(data);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar las áreas' });
        }
    };

    // Guardar un área (Crear o Editar)
    const saveArea = async () => {
        const method = selectedArea ? 'PUT' : 'POST';
        const url = selectedArea
            ? `https://saia-api.onrender.com/areas/${selectedArea.idArea}`
            : 'https://saia-api.onrender.com/areas';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArea),
            });

            if (response.ok) {
                fetchAreas();
                setIsDialogVisible(false);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Área guardada' });
            }
        } catch (error) {
            console.error('Error al guardar el área:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el área' });
        }
    };

    // Eliminar un área
    const deleteArea = async (idArea) => {
        try {
            const response = await fetch(`https://saia-api.onrender.com/areas/${idArea}`, { method: 'DELETE' });

            if (response.ok) {
                fetchAreas();
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Área eliminada' });
            }
        } catch (error) {
            console.error('Error al eliminar el área:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el área' });
        }
    };

    // Mostrar diálogo para editar o agregar un área
    const openDialog = (area) => {
        setSelectedArea(area);
        setNewArea(area || { clave: '', nombre: '' });
        setIsDialogVisible(true);
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <Toast ref={toast} />
            <h2>Gestión de Áreas</h2>
            <Button
                label="Nueva Área"
                icon="pi pi-plus"
                className="p-button-success"
                onClick={() => openDialog(null)}
                style={{ marginBottom: '1rem' }}
            />
            <DataTable value={areas} paginator rows={10} selectionMode="single">
                <Column field="clave" header="Clave del Área" />
                <Column field="nombre" header="Nombre del Área" />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-info"
                                onClick={() => openDialog(rowData)}
                                style={{ marginRight: '0.5rem' }}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={() => deleteArea(rowData.idArea)}
                            />
                        </>
                    )}
                />
            </DataTable>

            <Dialog
                header={selectedArea ? 'Editar Área' : 'Nueva Área'}
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setIsDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={saveArea} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="clave">Clave</label>
                        <InputText
                            id="clave"
                            value={newArea.clave}
                            onChange={(e) => setNewArea({ ...newArea, clave: e.target.value })}
                            placeholder="Escribe la clave del área"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={newArea.nombre}
                            onChange={(e) => setNewArea({ ...newArea, nombre: e.target.value })}
                            placeholder="Escribe el nombre del área"
                        />
                    </div>
                </div>
            </Dialog>

            <Button
                label="Ir al Índice"
                icon="pi pi-home"
                className="p-button-secondary"
                onClick={() => (window.location.href = '/')}
                style={{ marginTop: '1rem' }}
            />
        </div>
    );
};

export default Areas;
