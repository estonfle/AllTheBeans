import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import type { OrderResponse, OrderItemRequest } from '../types';
import { ordersApi } from '../api/orders';
import { useNotification } from '../context/NotificationContext';

interface Props {
    order: OrderResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditOrderDialog({ order, onClose, onSuccess }: Props) {
    // We map the complex response to the simple request format for editing
    const [items, setItems] = useState<OrderItemRequest[]>([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (order) {
            setItems(order.items.map(i => ({ beanId: i.beanId, quantity: i.quantity })));
        }
    }, [order]);

    const handleUpdateQty = (beanId: number, newQty: number) => {
        setItems(prev => prev.map(i => i.beanId === beanId ? { ...i, quantity: Math.max(1, newQty) } : i));
    };

    const handleRemove = (beanId: number) => {
        setItems(prev => prev.filter(i => i.beanId !== beanId));
    };

    const handleSave = async () => {
        if (!order) return;
        if (items.length === 0) {
            showNotification("Order must have at least one item. Cancel it instead.", "warning");
            return;
        }
        try {
            await ordersApi.updateOrder(order.orderId, { items });
            showNotification("Order updated successfully", "success");
            onSuccess();
            onClose();
        } catch (error) {
            // Handled by interceptor
        }
    };

    if (!order) return null;

    return (
        <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Modify Order #{order.orderId}</DialogTitle>
            <DialogContent>
                <List>
                    {order.items.map(item => {
                        // Find current current quantity in local state
                        const currentQty = items.find(i => i.beanId === item.beanId)?.quantity || 0;
                        if (currentQty === 0) return null; // Effectively removed

                        return (
                            <ListItem key={item.beanId}>
                                <ListItemText
                                    primary={item.beanName}
                                    secondary={`£${item.unitPrice} each`}
                                />
                                <TextField
                                    type="number" size="small" sx={{ width: 80, mr: 2 }}
                                    value={currentQty}
                                    onChange={(e) => handleUpdateQty(item.beanId, parseInt(e.target.value))}
                                />
                                <IconButton color="error" onClick={() => handleRemove(item.beanId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
}