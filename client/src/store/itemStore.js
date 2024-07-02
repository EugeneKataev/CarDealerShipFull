import { create} from 'zustand';
import showAlert from '../components/showAlert'

const useItemStore = create((set, get) => ({
    items: [],
    models: [],
    loading: false,
    error: null,

    fetchItems: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/items');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ items: data, loading: false, error: null });
                await get().fetchModels();
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchModels: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/items/all-models');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ models: data, error: null });
        } catch (error) {
            set({error: error.message})
        }
    },

    fetchItemById: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/items/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ loading: false, error: null });
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            return null;
        }
    },

    fetchItemsByModel: async (model) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/items/models/${model}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ items: data, loading: false, error: null });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    updModelFunc: (itemData) => {
        const newModels = [...get().models];
        itemData.compatibleModels.forEach(model => {
            if (!newModels.includes(model)) {
                newModels.push(model);
            }
        })
        return newModels
    },

    createItem: async (itemData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            let newModels = [...get().models];
            itemData.compatibleModels.forEach(model => {
                if (!newModels.includes(model)) {
                    newModels.push(model);
                }
            })
            set(state => ({
                items: [...state.items, data],
                models: get().updModelFunc(itemData),
                loading: false,
                error: null,
            }));
            showAlert("Товар успешно создан","success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при создании товара: ${error.message}`, "error");
        }
    },

    updateItem: async (id, itemData) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                items: state.items.map(item => item.id === id ? data : item),
                models: get().updModelFunc(itemData),
                loading: false,
                error: null,
            }));
            showAlert("Данные о товаре успешно обновлены","success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при обновлении товара: ${error.message}`, "error");
        }
    },

    deleteItem: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/items/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            set(state => ({
                items: state.items.filter(item => item.id !== id),
                loading: false,
                error: null,
            }));
            await get().fetchModels();
            showAlert("Товар успешно удален","success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при удалении товара: ${error.message}`, "error");
        }
    },
}));

export default useItemStore;
