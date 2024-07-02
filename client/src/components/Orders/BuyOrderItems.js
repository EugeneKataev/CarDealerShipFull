import React, { useState, useEffect, useRef } from 'react';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import useOrderStore from '../../store/orderStore';
import Button from '../shared/Button';
import styles from './BuyOrder.module.css';

const BuyOrderAuto = () => {
    const { selectedClient, selectedAuto } = useCurrentSelectionStore();
    const { createOrder, buyOrderItems, clearItemsOrder, removeItemFromBuyOrder, itemQuantityChange } = useOrderStore();
    const [isVisible, setIsVisible] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        if (!firstRender){
            clearItemsOrder();
        }
        if (selectedClient && selectedAuto) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [selectedClient, selectedAuto]);


    const calculateTotalPrice = () => {
        return buyOrderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleSubmitOrder = async () => {
        if (buyOrderItems.length === 0) {
            alert('Пожалуйста добавте товары для оформления заказа');
            return;
        }
        const getCurrentDate = () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        }
        const orderData = {
            clientId: selectedClient.id,
            autoId: selectedAuto.id,
            date: getCurrentDate(),
            items: buyOrderItems.map(item => ({ id: item.id, quantity: item.quantity })),
            price: calculateTotalPrice()
        };

            await createOrder(orderData);
            clearItemsOrder();
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.buyOrderContainer} main-list-item no-hover`}>
            <div className={styles.close} onClick={()=>{clearItemsOrder()}}>X</div>
            <h2>Создание заказа на покупку запчастей к авто:</h2>
            <div className={styles.selectedInfo}>
                {selectedClient && <p>Клиент: {selectedClient.name}</p>}
                {selectedAuto && (<p>Авто: {selectedAuto.brand} {selectedAuto.modelType}</p>)}
            </div>
            <div className={styles.itemsList}>
                {buyOrderItems && buyOrderItems.map(item => (
                    <div key={item.id} className={styles.itemEntry}>
                        <span>{item.name}</span>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => itemQuantityChange(item.id, e.target.value)}
                            min="1"
                            max={item.maxQuantity}
                        />
                        <span>${item.price * item.quantity}</span>
                        <Button onClick={() => removeItemFromBuyOrder(item.id)}>Удалить</Button>
                    </div>
                ))}
            </div>
            <div className={styles.totalPrice}>
                <strong>Сумма: ${calculateTotalPrice()}</strong>
            </div>
            <Button className={styles.submitBtn} onClick={handleSubmitOrder}>Подтвердить заказ</Button>
        </div>
    );
};

export default BuyOrderAuto;