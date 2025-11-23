import { useEffect, useState } from 'react';
import { Typography, Paper, Box, Button, Grid, CircularProgress, Divider } from '@mui/material';
import type { OrderResponse } from '../types';
import { ordersApi } from '../api/orders';
import EditOrderDialog from '../components/EditOrderDialog';
import { useNotification } from '../context/NotificationContext';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState<OrderResponse | null>(null);
    const { showNotification } = useNotification();

    const fetchOrders = () => {
        ordersApi.getMyOrders()
            .then(setOrders)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = async (id: number) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await ordersApi.cancelOrder(id);
            showNotification("Order cancelled", "info");
            fetchOrders();
        } catch (e) { /* handled globally */ }
    };

    if (loading) return <CircularProgress />;

    return (
        <>
            <Typography variant="h4" gutterBottom>Your Orders</Typography>
            {orders.length === 0 && <Typography>No orders found.</Typography>}

            <Box display="flex" flexDirection="column" gap={3}>
                {orders.map(order => (
                    <Paper key={order.orderId} sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
                            <Typography variant="h6">
                                Order #{order.orderId}
                                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </Typography>
                            </Typography>
                            <Box>
                                <Button size="small" sx={{ mr: 1 }} onClick={() => setEditingOrder(order)}>Modify</Button>
                                <Button size="small" color="error" onClick={() => handleCancel(order.orderId)}>Cancel</Button>
                            </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {order.items.map((item, idx) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <img src={item.image} alt={item.beanName} style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }} />
                                        <Box>
                                            <Typography variant="subtitle2">{item.beanName}</Typography>
                                            <Typography variant="caption">Qty: {item.quantity} x £{item.unitPrice}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={2} textAlign="right">
                            <Typography variant="h6" color="primary">Total: £{order.totalCost.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Box>

            <EditOrderDialog
                order={editingOrder}
                onClose={() => setEditingOrder(null)}
                onSuccess={fetchOrders}
            />
        </>
    );
}