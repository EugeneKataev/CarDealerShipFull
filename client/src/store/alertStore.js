import { create } from 'zustand';

const useAlertStore = create((set) => ({
    alerts: [],
    addAlert: (message, type) => set((state) => {
        const newAlert = {
            id: Date.now(),
            message,
            type,
        };
        return { alerts: [...state.alerts, newAlert] };
    }),
    removeAlert: (id) => set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
}));

export default useAlertStore;
