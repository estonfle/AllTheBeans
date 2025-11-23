import { Drawer, Box, Typography, List, ListItem, ListItemText, Button, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../api/orders';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
    const { items, removeFromCart, totalCost, clearCart } = useCart();
    const { showNotification } = useNotification();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            onClose();
            navigate('/login');
            return;
        }

        try {
            const payload = { items: items.map(i => ({ beanId: i.bean.id, quantity: i.quantity })) };
            await ordersApi.createOrder(payload);
            showNotification("Order placed successfully!", "success");
            clearCart();
            onClose();
            navigate('/orders');
        } catch (err) { /* Handled globally */ }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 350, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h5" gutterBottom>Your Order</Typography>
                <Divider />

                <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {items.length === 0 && <Typography sx={{ mt: 2, textAlign: 'center' }}>Cart is empty</Typography>}
                    {items.map(item => (
                        <ListItem key={item.bean.id} secondaryAction={
                            <IconButton edge="end" onClick={() => removeFromCart(item.bean.id)}><DeleteIcon /></IconButton>
                        }>
                            <ListItemText
                                primary={item.bean.name}
                                secondary={`${item.quantity} x £${item.bean.cost} = £${(item.quantity * item.bean.cost).toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" align="right">Total: £{totalCost.toFixed(2)}</Typography>
                <Button
                    variant="contained" fullWidth size="large" sx={{ mt: 2 }}
                    disabled={items.length === 0} onClick={handleCheckout}
                >
                    {isAuthenticated ? 'Checkout' : 'Login to Checkout'}
                </Button>
            </Box>
        </Drawer>
    );
}