import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

const Documentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [newDocumento, setNewDocumento] = useState({
        clave: 'XXXXXXXXXX',  // Valor por defecto
        nombre: 'EJEMPLO',  // Valor por defecto
        idTipo: 1,  // Valor por defecto
        idArea: 11,  // Valor por defecto
        archivo: 'x',  // Valor por defecto
    });
    const [tiposDocs, setTiposDocs] = useState([]);
    const [areas, setAreas] = useState([]);
    const toast = useRef(null);
    const navigate = useNavigate();

    // Cargar documentos desde la API
    const fetchDocumentos = async () => {
        try {
            const response = await fetch('https://saia-api.onrender.com/documentos');
            const data = await response.json();
            setDocumentos(data);
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de documentos' });
        }
    };

    // Cargar tipos de documentos desde la API
    const fetchTiposDocs = async () => {
        try {
            const response = await fetch('https://saia-api.onrender.com/tiposDocs');
            const data = await response.json();
            console.log("Documentos")
            console.log(data);
            setTiposDocs(data);
        } catch (error) {
            console.error('Error al cargar tipos de documentos:', error);
        }
    };

    // Cargar áreas desde la API
    const fetchAreas = async () => {
        try {
            const response = await fetch('https://saia-api.onrender.com/areas');
            const data = await response.json();
            setAreas(data);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    };

    useEffect(() => {
        fetchDocumentos();
        fetchTiposDocs();
        fetchAreas();
    }, []);

    // Guardar un documento (Crear o Editar)
    const saveDocumento = async () => {
        const method = selectedDocumento ? 'PUT' : 'POST';
        const url = selectedDocumento
            ? `https://saia-api.onrender.com/documentos/${selectedDocumento.idDocumento}`
            : 'https://saia-api.onrender.com/documentos';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDocumento),
            });

            if (response.ok) {
                fetchDocumentos();
                setIsDialogVisible(false);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Documento guardado' });
            }
        } catch (error) {
            console.error('Error al guardar el documento:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el documento' });
        }
    };

    // Eliminar un documento
    const deleteDocumento = async (idDocumento) => {
        try {
            const response = await fetch(`https://saia-api.onrender.com/documentos/${idDocumento}`, { method: 'DELETE' });

            if (response.ok) {
                fetchDocumentos();
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado' });
            }
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el documento' });
        }
    };

    // Mostrar diálogo para editar o agregar un documento
    const openDialog = (documento) => {
        setSelectedDocumento(documento);
        setNewDocumento(documento || { clave: 'XXXXXXXXXX', nombre: 'EJEMPLO', idTipo: 1, idArea: 11, archivo: 'x' });
        setIsDialogVisible(true);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <Toast ref={toast} />
            <Button
                label="Volver al Índice"
                icon="pi pi-arrow-left"
                className="p-button-secondary"
                onClick={() => navigate('/')}
                style={{ marginBottom: '1rem' }}
            />
            <h2>Gestión de Documentos</h2>
            <Button
                label="Nuevo Documento"
                icon="pi pi-plus"
                className="p-button-success"
                onClick={() => openDialog(null)}
                style={{ marginBottom: '1rem' }}
            />
            <DataTable value={documentos} paginator rows={10} selectionMode="single">
                <Column field="clave" header="Clave" />
                <Column field="nombre" header="Nombre" />
                <Column field="idTipo" header="Tipo" />
                <Column field="idArea" header="Área" />
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
                                onClick={() => deleteDocumento(rowData.idDocumento)}
                            />
                        </>
                    )}
                />
            </DataTable>

            <Dialog
                header={selectedDocumento ? 'Editar Documento' : 'Nuevo Documento'}
                visible={isDialogVisible}
                style={{ width: '50vw' }}
                onHide={() => setIsDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Cancelar" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} />
                        <Button label="Guardar" icon="pi pi-check" onClick={saveDocumento} />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="clave">Clave</label>
                        <InputText
                            id="clave"
                            value={newDocumento.clave}
                            onChange={(e) => setNewDocumento({ ...newDocumento, clave: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={newDocumento.nombre}
                            onChange={(e) => setNewDocumento({ ...newDocumento, nombre: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="idTipo">Tipo</label>
                        <Dropdown
                            id="idTipo"
                            value={newDocumento.idTipo}
                            options={tiposDocs.map((tipo) => ({ label: tipo.nombre, value: tipo.id }))}
                            onChange={(e) => setNewDocumento({ ...newDocumento, idTipo: e.value })}
                            placeholder="Selecciona un tipo"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="idArea">Área</label>
                        <Dropdown
                            id="idArea"
                            value={newDocumento.idArea}
                            options={areas.map((area) => ({ label: area.nombre, value: area.id }))}
                            onChange={(e) => setNewDocumento({ ...newDocumento, idArea: e.value })}
                            placeholder="Selecciona un área"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="archivo">Archivo</label>
                        <InputText
                            id="archivo"
                            value={newDocumento.archivo}
                            onChange={(e) => setNewDocumento({ ...newDocumento, archivo: e.target.value })}
                            placeholder="Escribe la ruta o nombre del archivo"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Documentos;
