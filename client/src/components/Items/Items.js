import React, { useEffect, useState } from 'react';
import useItemStore from '../../store/itemStore';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import useOrderStore from "../../store/orderStore";
import ItemModal from './ItemModal';
import styles from './Items.module.css';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import showAlert from "../showAlert";
import highlightCue from "../highlightCue";

const Items = () => {
    const { items, fetchItems, models, fetchItemsByModel, deleteItem } = useItemStore();
    const { selectedClient, selectedAuto } = useCurrentSelectionStore();
    const { addItemToBuyOrder } = useOrderStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
    const [modelFilter, setModelFilter] = useState('');

    useEffect(() => {
        if (selectedAuto) {
            setModelFilter(selectedAuto.modelType);
            fetchItemsByModel(selectedAuto.modelType);
        } else {
            setModelFilter('');
             fetchItems();
        }
    }, [selectedAuto, fetchItems, fetchItemsByModel]);

    const handleOpenModal = (item, mode) => {
        setSelectedItem(item);
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setModalMode('view');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены что хотите удалить товар?')) {
            await deleteItem(id);
        }
    };

    const handleModelFilterChange = (e) => {
        const model = e.target.value;
        setModelFilter(model);
        if (model) {
            fetchItemsByModel(model);
        } else {
            fetchItems();
        }
    };

    const handleAddToBuyOrder = (formData = selectedItem) => {
        if (!selectedClient || !selectedAuto) {
            showAlert("Должен быть выбран клиент и его авто");
            highlightCue(".clientAutoSelectionArea");
            handleCloseModal();
            return
        }
        const quantity = parseInt(prompt('Введите количество:', '1'));
        if (quantity > 0 && (quantity) <= formData.quantity) {
            addItemToBuyOrder({ ...formData, quantity: quantity, maxQuantity: formData.quantity });
            handleCloseModal();
        } else {
            showAlert("неверное количество");
        }
    };

    return (
        <div className={`${styles.itemsContainer} main-block itemsSelectionArea`}>
            <h2>Товары</h2>
            <div className={styles.filterContainer}>
                <select
                    value={modelFilter}
                    className="main-list-item"
                    onChange={handleModelFilterChange}
                    disabled={!!selectedAuto}
                >
                    <option value="">Все модели</option>
                    {models.map((auto) => (
                        <option key={auto} value={auto}>{auto}</option>
                    ))}
                </select>
            </div>
            <div className={styles.itemsList}>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <div onClick={() => handleOpenModal(item, 'view')} key={item.id} className={`${styles.itemCard} main-list-item`}>
                            <h3>{item.name}</h3>
                            <p>Цена: ${item.price}</p>
                            <p>Количество: {item.quantity}</p>
                            <Button onClick={(e) => {e.stopPropagation(); handleAddToBuyOrder(item)}}>Добавить</Button>
                            <Button onClick={(e) => {e.stopPropagation(); handleOpenModal(item, 'edit')}}>Редактировать</Button>
                            <Button onClick={(e) => {e.stopPropagation(); handleDelete(item.id)}}>Удалить</Button>
                        </div>
                    ))
                ) : (
                    <p>Товары не найдены.</p>
                )}
            </div>
            <div className={styles.addBottom}>
                <Button onClick={() => handleOpenModal(null, 'create')}>Создать новый товар</Button>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                <ItemModal
                    item={selectedItem}
                    mode={modalMode}
                    onClose={handleCloseModal}
                    onAddToBuyOrder={handleAddToBuyOrder}
                />
            </Modal>
        </div>
    );
};

export default Items;