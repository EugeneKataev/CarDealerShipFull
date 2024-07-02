import React, { useState, useEffect } from 'react';
import useAutoStore from '../../store/autoStore';
import Button from '../shared/Button';
import styles from './AutoModal.module.css';

const AutoModal = ({ auto, mode, onClose, onBuyAuto }) => {
    const { createAuto, updateAuto, fetchAutoById } = useAutoStore();
    const [formData, setFormData] = useState({ brand: '', year: '', price: '', modelType: '' });

    useEffect(() => {
        if (auto && mode !== 'create') {
            fetchAutoById(auto.id).then(setFormData);
        }
    }, [auto, mode, fetchAutoById]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'create') {
            await createAuto(formData);
        } else if (mode === 'edit') {
            await updateAuto(auto.id, formData);
        }
        onClose();
    };


    return (
        <div className={`${styles.modalContent} main-block`}>
            <h2>{mode === 'create' ? 'Создать новое авто' : mode === 'edit' ? 'Редактировать авто' : 'Данные об авто'}</h2>
            {mode === 'view' ? (
                <div>
                    <p>Марка: {formData.brand}</p>
                    <p>Модель: {formData.modelType}</p>
                    <p>Год: {formData.year}</p>
                    <p>Цена: ${formData.price}</p>
                    <Button onClick={onClose}>Закрыть</Button>
                    <Button onClick={() => onBuyAuto(auto)}>Купить</Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Марка"
                        required
                    />
                    <input
                        type="text"
                        name="modelType"
                        value={formData.modelType}
                        onChange={handleInputChange}
                        placeholder="Модель"
                        required
                    />
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        placeholder="Год"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Цена"
                        required
                    />
                    <Button type="submit">{mode === 'create' ? 'Создать' : 'Сохранить'}</Button>
                    <Button onClick={onClose}>Отмена</Button>
                </form>
            )}
        </div>
    );
};

export default AutoModal;