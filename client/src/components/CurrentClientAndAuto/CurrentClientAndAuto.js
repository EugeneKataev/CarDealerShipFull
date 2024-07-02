import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useCurrentSelectionStore from '../../store/currentSelectionStore';
import useAutoStore from '../../store/autoStore';
import Button from '../shared/Button';
import styles from './CurrentClientAndAuto.module.css';
import highlightCue from "../highlightCue";
import showAlert from "../showAlert";

const CurrentClientAndAuto = () => {
    const { selectedClient, selectedAuto, clearClient, selectAuto, clientAutos, selectClientAutos } = useCurrentSelectionStore();
    const { fetchClientAutos } = useAutoStore();

    useEffect(() => {
        selectAuto(null);
        if (selectedClient) {
            fetchClientAutos(selectedClient.id);
        } else {
            selectClientAutos([]);
        }
        console.log(clientAutos);
    }, [selectedClient, fetchClientAutos]);

    const handleClearClient = () => {
        clearClient();
    };

    const handleAutoChange = (e) => {
        const autoId = parseInt(e.target.value);
        const selectedAuto = clientAutos.find(auto => auto.id === autoId);
        selectAuto(selectedAuto);
    };
    const handleClickCue = (cueClass) => {
        highlightCue(cueClass);
        showAlert("Выберите клиента в блоке 'Клиенты'");
    }

    return (
        <div className={`${styles.container} main-block clientAutoSelectionArea`}>
            <div onClick={!selectedClient ? ()=>{handleClickCue('.clientSelection .clientSelectionArea')} : null}
                 style={{cursor: !selectedClient && 'pointer'}}  className={`${styles.clientSection} clientSelectionArea`}>
                <h3>{selectedClient ? "Выбранный клиент" : "Выберите клиента"}</h3>
                <div className={styles.inlineElements}>
                    {selectedClient ? (
                        <>
                            <p>{selectedClient.name}</p>
                            <p>{selectedClient.phone}</p>
                            <Button onClick={handleClearClient}>Очистить клиента</Button>
                        </>
                    ) : (
                        <p>Клиент не выбран</p>
                    )}
                </div>
            </div>
            <div onClick={!selectedClient ? ()=>{handleClickCue('.clientSelectionArea')} : null}
                 style={{cursor: !selectedClient && 'pointer'}} className={styles.autoSection}>
                <h3>{selectedAuto ? "Выбранный авто" : "Выберите авто"}</h3>
                <div className={styles.inlineElements}>
                    {selectedClient ? (
                        clientAutos.length > 0 ? (
                        <select
                            value={selectedAuto ? selectedAuto.id : ''}
                            onChange={handleAutoChange}
                        >
                            <option value="">Выберите автомобиль</option>
                            {clientAutos.map(auto => (
                                <option key={`${uuidv4()}`} value={auto.id}>
                                    {auto.modelType}
                                </option>
                            ))}
                        </select> ) : (<p>У клиента нет авто</p>)
                    ) : (
                        <p>Нужно выбрать сначала клиента</p>
                    )}
                    {selectedAuto && (
                        <div className={styles.selectedAuto}>
                            <p>{selectedAuto.brand} {selectedAuto.modelType}</p>
                            <p>Год выпуска: {selectedAuto.year}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrentClientAndAuto;