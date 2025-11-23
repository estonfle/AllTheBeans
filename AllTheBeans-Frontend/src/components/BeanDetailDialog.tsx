import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, TextField } from '@mui/material';
import type { CoffeeBean } from '../types';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface Props {
    bean: CoffeeBean | null;
    open: boolean;
    onClose: () => void;
}

export default function BeanDetailDialog({ bean, open, onClose }: Props) {
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const { showNotification } = useNotification();

    if (!bean) return null;

    const handleAdd = () => {
        addToCart(bean, qty);
        showNotification(`Added ${qty} x ${bean.name} to cart`, 'success');
        setQty(1);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box position="relative">
                <img
                    src={getOptimizedImageUrl(bean.image, 800)}
                    alt={bean.name}
                    style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                />
            </Box>
            <DialogTitle variant="h4">{bean.name}</DialogTitle>
            <DialogContent>
                <Box display="flex" gap={1} mb={2}>
                    <Chip label={bean.country} color="primary" />
                    <Chip label={bean.colour} variant="outlined" />
                </Box>
                <Typography variant="body1" paragraph>{bean.description}</Typography>
                <Typography variant="h5" color="primary">£{bean.cost} <Typography component="span" variant="body2" color="text.secondary">per unit</Typography></Typography>

                <Box mt={3} display="flex" alignItems="center" gap={2}>
                    <TextField
                        type="number" label="Quantity"
                        value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        size="small" sx={{ width: 100 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit">Close</Button>
                <Button variant="contained" onClick={handleAdd}>Add to Order</Button>
            </DialogActions>
        </Dialog>
    );
}