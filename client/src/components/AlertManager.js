import React, { useEffect } from 'react';
import useAlertStore from '../store/alertStore';

const AlertManager = () => {
    const { alerts, removeAlert } = useAlertStore();

    useEffect(() => {
        alerts.forEach((alert) => {
            const timer = setTimeout(() => {
                removeAlert(alert.id);
            }, 1500);

            return () => clearTimeout(timer);
        });
    }, [alerts, removeAlert]);

    return (
        <div className="alertShow">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className="alertShow-message"
                    style={{
                        backgroundColor: alert.type === 'success' ? 'green' :
                            alert.type === 'error' ? 'red' :
                                alert.type === 'change' ? 'rgb(53 125 150)' : '#d68f19'
                    }}
                >
                    {alert.message}
                </div>
            ))}
        </div>
    );
};

export default AlertManager;