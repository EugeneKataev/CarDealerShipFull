import React, { useState, useEffect } from 'react';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import useOrderStore from '../../store/orderStore';
import Button from '../shared/Button';
import styles from './BuyOrder.module.css';

const BuyOrderAuto = () => {
    const { selectedClient, addClientAuto } = useCurrentSelectionStore();
    const { createAutoDeal, selectedAutoToBuy, setSelectedAutoBuy } = useOrderStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (selectedClient && selectedAutoToBuy) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [selectedClient, selectedAutoToBuy]);


    const handleSubmitOrder = async () => {

        const getCurrentDate = () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        }

        const orderData = {
            clientId: selectedClient.id,
            autoId: selectedAutoToBuy.id,
            date: getCurrentDate(),
            price: selectedAutoToBuy.price,
            modelType: selectedAutoToBuy.modelType,
            year: selectedAutoToBuy.year
        };

        createAutoDeal(orderData);
        setSelectedAutoBuy(null);

    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.buyOrderContainer} main-list-item no-hover`}>
            <div className={styles.close} onClick={()=>{setSelectedAutoBuy(null)}}>X</div>
            <h2>Создание заказа на покупку автомобиля:</h2>
            <div className={styles.selectedInfo}>
                {selectedClient && <p>Клиент: {selectedClient.name}</p>}
                {selectedAutoToBuy && (<p>Авто: {selectedAutoToBuy.brand} {selectedAutoToBuy.modelType} {selectedAutoToBuy.year}</p>)}
            </div>
            <div className={styles.totalPrice}>
                <strong>Total: ${selectedAutoToBuy.price}</strong>
            </div>
            <Button onClick={handleSubmitOrder}>Подтвердить заказ</Button>
        </div>
    );
};

export default BuyOrderAuto;