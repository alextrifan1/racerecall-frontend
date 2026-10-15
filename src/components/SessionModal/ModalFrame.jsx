import { useEffect, useRef } from 'react';
import styles from './SessionModal.module.css';

export default function ModalFrame({ isOpen, onClose, titleId, children }) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const previousFocus = document.activeElement;     // the tile that opened it
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';          // stop the page behind from scrolling
        closeRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();                     // back to where the user was
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={closeRef}
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
}
