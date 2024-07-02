import React, { useEffect, useState } from 'react';
import useAutoStore from '../../store/autoStore';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import useOrderStore from "../../store/orderStore";
import AutoModal from './AutoModal';
import styles from './Autos.module.css';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import highlightCue from "../highlightCue";

const Autos = () => {
    const { autos, fetchAutos, deleteAuto } = useAutoStore();
    const { selectedClient } = useCurrentSelectionStore();
    const { setSelectedAutoBuy } = useOrderStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAutoForModal, setSelectedAutoForModal] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'

    useEffect(() => {
        fetchAutos();
    }, [fetchAutos]);

    const handleOpenModal = (auto, mode) => {
        setSelectedAutoForModal(auto);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAutoForModal(null);
        setModalMode('view');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this auto?')) {
            await deleteAuto(id);
        }
    };

    const handleBuy = (auto) => {
        if (!selectedClient) {
            highlightCue(".clientSelectionArea");
        } else {
            setSelectedAutoBuy(auto);
            highlightCue(".orderSelectionArea", "info");
        }
        handleCloseModal();
    };

    return (
        <div className={`${styles.autosContainer} main-block`}>
            <h2>Авто</h2>
            <div className={styles.autosList}>
                {autos && autos.length > 0 ? (
                    autos.map((auto) => (
                        <div onClick={() => handleOpenModal(auto, 'view')} key={auto.id} className={`${styles.autoItem} main-list-item`}>
                                <span>{auto.brand} {auto.modelType}</span>
                                <span>{auto.year}</span>
                                <span>${auto.price}</span>
                            <div>
                                <Button onClick={(e) => {e.stopPropagation(); handleOpenModal(auto, 'edit')}}>Редактировать</Button>
                                <Button onClick={(e) => {e.stopPropagation(); handleDelete(auto.id)}}>Удалить</Button>
                                <Button onClick={(e) => {e.stopPropagation(); handleBuy(auto)}}>Покупка</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Авто не найдены.</p>
                )}
            </div>
            <div className={styles.addBottom}>
                <Button onClick={() => handleOpenModal(null, 'create')}>Создать авто</Button>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                <AutoModal
                    auto={selectedAutoForModal}
                    mode={modalMode}
                    onClose={handleCloseModal}
                    onBuyAuto={handleBuy}
                />
            </Modal>
        </div>
    );
};

export default Autos;