import React, { useState, useEffect } from 'react';
import useItemStore from '../../store/itemStore';
import Button from '../shared/Button';
import styles from './ItemModal.module.css';

const ItemModal = ({ item, mode, onClose, onAddToBuyOrder }) => {
    const { createItem, updateItem, fetchItemById } = useItemStore();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        compatibleModels: [],
        price: '',
        quantity: ''
    });

    useEffect(() => {
        if (item && mode !== 'create') {
            fetchItemById(item.id).then(setFormData);
        }
    }, [item, mode, fetchItemById]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompatibleModelsChange = (e) => {
        const models = e.target.value.split(',').map(model => model.trim());
        setFormData(prev => ({ ...prev, compatibleModels: models }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'create') {
            await createItem(formData);
        } else if (mode === 'edit') {
            await updateItem(item.id, formData);
        }
        onClose();
    };

    return (
        <div className={`${styles.modalContent} main-block`}>
            <h2>{mode === 'create' ? 'Создание нового товара' : mode === 'edit' ? 'Редактирование товара' : 'Просмотр товара'}</h2>
            {mode === 'view' ? (
                <div>
                    <p>Название: {formData.name}</p>
                    <p>Описание: {formData.description}</p>
                    <p>Compatible Models: {formData.compatibleModels.join(', ')}</p>
                    <p>Цена: ${formData.price}</p>
                    <p>Количество: {formData.quantity}</p>
                    <Button onClick={onClose}>Закрыть</Button>
                    <Button onClick={() => onAddToBuyOrder(formData)}>Добавить товар в корзину</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Название"
                        required
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Описание"
                        required
                    />
                    <input
                        type="text"
                        name="compatibleModels"
                        value={formData.compatibleModels.join(', ')}
                        onChange={handleCompatibleModelsChange}
                        placeholder="Compatible Models"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Цена"
                        required
                        min="0"
                        step="1"
                    />
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="Количество"
                        required
                        min="0"
                    />
                    <Button type="submit">{mode === 'create' ? 'Создать' : 'Сохранить'}</Button>
                    <Button onClick={onClose}>Назад</Button>
                </form>
            )}
        </div>
    );
};

export default ItemModal;