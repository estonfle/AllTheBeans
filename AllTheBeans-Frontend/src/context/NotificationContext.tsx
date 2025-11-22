import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';
import eventBus from '../utils/eventBus';

interface NotificationContextType {
    showNotification: (message: string, type?: AlertColor) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode; }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showNotification = (msg: string, type: AlertColor = 'info') => {
        setMessage(msg);
        setSeverity(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // This useEffect connects the "Non-React" API Client to this "React" Component
    useEffect(() => {
        const handleApiEvent = (detail: any) => {
            showNotification(detail.message, detail.type);
        };

        // Listen for events dispatched from 'src/api/client.ts'
        eventBus.on('SHOW_TOAST', handleApiEvent);

        // Cleanup listener when app unmounts
        return () => eventBus.remove('SHOW_TOAST', handleApiEvent);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within NotificationProvider');
    return context;
};