import useAlertStore from '../store/alertStore';

const showAlert = (message, type = 'info') => {
    const addAlert = useAlertStore.getState().addAlert;
    addAlert(message, type);
};
export default showAlert;