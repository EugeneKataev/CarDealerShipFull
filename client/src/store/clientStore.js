import { create } from 'zustand';
import useCurrentSelectionStore from "./currentSelectionStore";
import showAlert from '../components/showAlert'

const useClientStore = create((set, get) => ({
    clients: [],
    selectedClient: null,
    loading: false,
    error: null,

    fetchClients: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/clients');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ clients: data, loading: false, error: null });
        } catch (error) {
            set({ error: error.message, loading: true });
        }
    },

    fetchClientById: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${id}`);
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

    createClient: async (clientData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                clients: [...state.clients, data],
                loading: false,
                error: null,
            }));
            showAlert("Клиент успешно создан","success")
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при создании клиента: ${error.message}`, "error");
        }
    },

    updateClient: async (id, clientData) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                clients: state.clients.map(client => client.id === id ? data : client),
                loading: false,
                error: null,
            }));
            showAlert("Данные о клиенте успешно обновлены","success")
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка обновления клиента: ${error.message}`, "error");
        }
    },

    selectClient: (client) => {
        set({ selectedClient: client });
        useCurrentSelectionStore.getState().setSelectedClient(client);
        if (get().selectedClient) {
            showAlert(`Клиент выбран`, "change");
        }
    },

    clearSelectedClient: () => {
        set({ selectedClient: null });
    },

    // Метод для удаления клиента, если нужно:
    deleteClient: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            set(state => ({
                clients: state.clients.filter(client => client.id !== id),
                loading: false,
                error: null,
            }));
            showAlert("Клиент успешно удален","success")
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка удаления клиента: ${error.message}`, "error");
        }
    },
}));

export default useClientStore;