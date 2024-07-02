import { create } from 'zustand';
import useCurrentSelectionStore from "./currentSelectionStore";
import useItemStore from "./itemStore";
import showAlert from "../components/showAlert";

const useOrderStore = create((set, get) => ({
    orders: [],
    buyOrderItems: [],
    selectedAutoToBuy: null,
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ orders: data, loading: false, error: null });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchOrdersByClient: async (clientId) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/orders/client/${clientId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ orders: data, loading: false, error: null });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addItemToBuyOrder: (item) => set(state => {
        const existingItem = state.buyOrderItems.find(i => i.id === item.id);
        if (existingItem) {
            showAlert("Количество товара в заказе увеличено", "change");
            return {
                buyOrderItems: state.buyOrderItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                )
            };
        } else {
            showAlert("Товар добавлен в заказ", "change");
            return {
                buyOrderItems: [...state.buyOrderItems, { ...item, quantity:  item.quantity}]
            };
        }
    }),

    itemQuantityChange: (itemId, newQuantity) => set(state => {
        return {
            buyOrderItems: state.buyOrderItems.map(item =>
                item.id === itemId ? { ...item, quantity: parseInt(newQuantity) } : item
            )
        }
    }),

    removeItemFromBuyOrder: (itemId) => {
        set((state) => ({
            buyOrderItems: state.buyOrderItems.filter((item) => item.id !== itemId),
        }));
    },

    clearItemsOrder: () => {
        set({ buyOrderItems: [] });
    },

    createOrder: async (orderData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                orders: [...state.orders, data],
                loading: false,
                error: null,
            }));

            let selectedAuto = useCurrentSelectionStore.getState().selectedAuto;
            await useItemStore.getState().fetchItemsByModel(selectedAuto.modelType);
            showAlert("Заказ успешно оформлен", "success");
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка оформления заказа: ${error.message}`, "error");
        }
    },

    updateOrder: async (id, orderData) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                orders: state.orders.map(order => order.id === id ? data : order),
                loading: false,
                error: null,
            }));
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteOrder: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            set(state => ({
                orders: state.orders.filter(order => order.id !== id),
                loading: false,
                error: null,
            }));
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },
    setSelectedAutoBuy: async (auto) => {
        set({selectedAutoToBuy: auto});
        get().clearItemsOrder();
        if (auto) {
            document.querySelector(".itemsSelectionArea").classList.add("disabledBlock");
            showAlert("Авто добавлен в заказ", "change");
        } else {
            document.querySelector(".itemsSelectionArea").classList.remove("disabledBlock");
        }
    },

    createAutoDeal: async (dealData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/autodeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dealData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                orders: [...state.orders, data],
                loading: false,
                error: null,
            }));
            let autos = useCurrentSelectionStore.getState().clientAutos;
            let newAutos = [...autos, data];
            useCurrentSelectionStore.getState().selectClientAutos(newAutos);
            showAlert("Заказ успешно оформлен, авто добавлено пользователю", "success");
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при оформлении заказа ${error.message}`, "error");
            throw error;
        }
    },
}));

export default useOrderStore;
