import React, { useEffect, useState } from 'react';
import useClientStore from '../../store/clientStore';
import ClientModal from './ClientModal';
import styles from './Clients.module.css';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const Clients = () => {
    const { clients, fetchClients, selectClient, loading } = useClientStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleOpenModal = (client, mode) => {
        setSelectedClient(client);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
        setModalMode('view');
    };

    const handleSelectClient = (client) => {
        selectClient(client);
    };

    return (
        <div className={`${styles.clientsContainer} clientSelection main-block`}>
            <h2>Клиенты</h2>
            <div className={`${styles.clientsList} clientSelectionArea`}>
            {loading ? (
                <p>Загрузка клиентов...</p>
            ) : (
                <div className={styles.clientsListBlock}>
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <div onClick={() => handleOpenModal(client, 'view')} key={client.id} className={`${styles.clientItem} main-list-item`}>
                                <span>{client.name}</span>
                                <span>{client.phone}</span>
                                <div>
                                    <Button onClick={(e) => { e.stopPropagation(); handleOpenModal(client, 'edit')}}>Редактировать</Button>
                                    <Button className="clientSelectionArea"
                                            onClick={(e) => {e.stopPropagation(); handleSelectClient(client)}}>Выбрать</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Клиенты не найдены.</p>
                    )}
                </div>
            )}
            </div>
            <div className={styles.addBottom}>
                <Button onClick={() => handleOpenModal(null, 'create')}>Создать клиента</Button>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                <ClientModal
                    client={selectedClient}
                    mode={modalMode}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default Clients;