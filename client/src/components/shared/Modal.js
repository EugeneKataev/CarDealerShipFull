import React from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.css';


ReactModal.setAppElement('#root');

const Modal = ({ isOpen, onRequestClose, children }) => {
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onRequestClose}>
                    &times;
                </button>
                {children}
            </div>
        </ReactModal>
    );
};

export default Modal;