import React, { useEffect, useState } from 'react';
import useOrderStore from "../../store/orderStore";
import useCurrentSelectionStore from "../../store/currentSelectionStore";
import styles from "./Orders.module.css";
import OrdersList from "./OrdersList";
import BuyOrderAuto from "./BuyOrderAuto";
import BuyOrderItems from "./BuyOrderItems"

const Orders = () => {
    const { selectedAutoToBuy, buyOrderItems } = useOrderStore();
    const { selectedClient, selectedAuto } = useCurrentSelectionStore();

    return (
        <div className={`${styles.ordersContainer} orderSelectionArea`}>
            {(selectedClient && selectedAutoToBuy) ? <BuyOrderAuto/> :
                (selectedClient && selectedAuto && buyOrderItems.length > 0) ? <BuyOrderItems/> :
                    <OrdersList/>
            }
        </div>
    );
};

export default Orders;