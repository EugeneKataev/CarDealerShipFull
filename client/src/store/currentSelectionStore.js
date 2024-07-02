import { create } from 'zustand';
import showAlert from '../components/showAlert'
import highlightCue from "../components/highlightCue";
import useOrderStore from "./orderStore";

const useCurrentSelectionStore = create((set, get) => ({
    selectedClient: null,
    selectedAuto: null,
    clientAutos: [],
    setSelectedClient: (client) => set({ selectedClient: client }),

    selectClient: (client) => {
        set({
            selectedClient: client,
            selectedAuto: null
        });
    },

    selectClientAutos: (data) => {
        set({ clientAutos: data });
    },

    addClientAuto: (newAuto) => {
        set(state => ({ clientsAutos: [...state.clientsAutos, newAuto] }));
    },

    selectAuto: (auto) => {
        set({ selectedAuto: auto });
        useOrderStore.getState().clearItemsOrder();
        if (get().selectedAuto) {
            showAlert("Подгружены модели товаров под авто", "change");
            highlightCue(".itemsSelectionArea", "info");
        }
    },

    clearClient: () => {
        set({
            selectedClient: null,
            selectedAuto: null
        });
    },

    clearAuto: () => {
        set({ selectedAuto: null });
    },

    clearAll: () => {
        set({
            selectedClient: null,
            selectedAuto: null
        });
    },

    // isClientSelected: () => {
    //     return !!get().selectedClient;
    // },

    // isAutoSelected: () => {
    //     return !!get().selectedAuto;
    // }
}));

export default useCurrentSelectionStore;