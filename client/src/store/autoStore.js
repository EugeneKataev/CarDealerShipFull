import { create } from 'zustand';
import useCurrentSelectionStore from "./currentSelectionStore";
import showAlert from '../components/showAlert'

const useAutoStore = create((set, get) => ({
    autos: [],
    loading: false,
    error: null,

    fetchAutos: async () => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/auto');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ autos: data, loading: false, error: null });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    fetchAutoById: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/auto/${id}`);
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

    createAuto: async (autoData) => {
        set({ loading: true });
        try {
            const response = await fetch('http://localhost:3000/api/auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(autoData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({ autos: [...state.autos, data], loading: false, error: null }));
            showAlert("Автомобиль успешно добавлен", "success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при добавлении автомобиля: ${error.message}`, "error");
        }
    },

    updateAuto: async (id, autoData) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/auto/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(autoData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set(state => ({
                autos: state.autos.map(auto => auto.id === id ? data : auto),
                loading: false,
                error: null
            }));
            showAlert("Данные об автомобиле успешно обновлены", "success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при обновлении данных о автомобиле: ${error.message}`, "error");
        }
    },

    deleteAuto: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/auto/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            set(state => ({
                autos: state.autos.filter(auto => auto.id !== id),
                loading: false,
                error: null
            }));
            showAlert("Автомобиль удален", "success");
        } catch (error) {
            set({ error: error.message, loading: false });
            showAlert(`Ошибка при удалении автомобиля: ${error.message}`, "error");
        }
    },

    fetchClientAutos: async (clientId) => {
        set({ loading: true });
        try {
            const response = await fetch(`http://localhost:3000/api/clients/${clientId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            set({ loading: false, error: null });
            useCurrentSelectionStore.getState().selectClientAutos(data.autos);
        } catch (error) {
            set({ error: error.message, loading: false });
            useCurrentSelectionStore.getState().selectClientAutos([]);
        }
    },
}));

export default useAutoStore;