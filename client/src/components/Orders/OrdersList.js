import React, { useEffect, useState } from 'react';
import useOrderStore from '../../store/orderStore';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import styles from './Orders.module.css';
import Button from '../shared/Button';

const OrdersList = () => {
    const { orders, fetchOrders, fetchOrdersByClient } = useOrderStore();
    const { selectedClient } = useCurrentSelectionStore();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        if (selectedClient) {
            fetchOrdersByClient(selectedClient.id);
        } else {
            fetchOrders();
        }
    }, [selectedClient, fetchOrders, fetchOrdersByClient]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={`${styles.ordersContainer} main-block`} style={{height: "440px", overflow: "auto"}}>
            <h2>Заказы</h2>
            {selectedClient && (
                <p className={styles.clientFilter}>
                    Показаны заказы для: {selectedClient.name}
                </p>
            )}
            <div className={styles.ordersList}>
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className={styles.orderItem}>
                            <div className={`${styles.orderSummary} main-list-item no-hover`}>
                                <span>Заказ №{order.id}</span>
                                <span>Дата: {order.date}</span>
                                <span>Сумма: ${order.price}</span>
                                <Button onClick={() => toggleOrderDetails(order.id)}>
                                    {expandedOrderId === order.id ? 'Скрыть детали' : 'Показать детали'}
                                </Button>
                            </div>
                            {expandedOrderId === order.id && (
                                <div className={styles.orderDetails}>
                                    <h4>Детали заказа</h4>
                                    <p>ID клиента: {order.clientId}</p>
                                    <p>ID авто: {order.autoId}</p>
                                    {order.autoBuy ? <h4>Приобритение машины</h4> : (
                                    <ul>
                                        <h4>Товары</h4>
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item) => (
                                                <li key={item.id}>
                                                    ID товара: {item.id}, Количество: {item.quantity}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Товары не найдены.</li>
                                        )}
                                        <h4>Сумма: ${order.price}</h4>
                                    </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Заказы не найдены.</p>
                )}
            </div>
        </div>
    );
};

export default OrdersList;