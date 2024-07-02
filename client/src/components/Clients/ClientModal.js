import React, { useState, useEffect } from 'react';
import useClientStore from '../../store/clientStore';
import Button from '../shared/Button';
import styles from './ClientModal.module.css';

const ClientModal = ({ client, mode, onClose }) => {
    const { createClient, updateClient, deleteClient, fetchClientById } = useClientStore();
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [fullClientData, setFullClientData] = useState(null);

    useEffect(() => {
        if (client && mode !== 'create') {
            fetchClientById(client.id).then(setFullClientData);
            setFormData({ name: client.name, phone: client.phone });
        }
    }, [client, mode, fetchClientById]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'create') {
            await createClient(formData);
        } else if (mode === 'edit') {
            await updateClient(client.id, formData);
        }
        onClose();
    };

    const handleDelete = async () => {
        if (window.confirm('Уверены что хотите удалить клиента?')) {
            await deleteClient(client.id);
            onClose();
        }
    };
    const handleSelectClient = () => {
        useClientStore.getState().selectClient(fullClientData);
        onClose();
    }

    if (mode === 'view' && !fullClientData) return <div>Loading...</div>;

    return (
        <div className={`${styles.modalContent} main-block`}>
            <h2>{mode === 'create' ? 'Создание нового клиента' : mode === 'edit' ? 'Редактирование клиента' : 'Данные клиента'}</h2>
            {mode === 'view' ? (
                <div>
                    <p>Имя: {fullClientData.name}</p>
                    <p>Телефон: {fullClientData.phone}</p>
                    <p>Авто: {fullClientData.autos.length > 0 ?
                        fullClientData.autos.map(auto => auto.modelType).join(', ') :
                        'Нет приобритенных авто'}
                    </p>
                    <Button onClick={() => onClose()}>Закрыть</Button>
                    <Button onClick={() => {handleSelectClient()}}>Выбрать</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        required
                    />
                    <Button type="submit">{mode === 'create' ? 'Создать' : 'Сохранить'}</Button>
                    {mode === 'edit' && <Button onClick={handleDelete}>Удалить</Button>}
                    <Button onClick={onClose}>Закрыть</Button>
                </form>
            )}
        </div>
    );
};

export default ClientModal;