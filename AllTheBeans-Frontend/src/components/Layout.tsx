import { AppBar, Toolbar, Typography, Button, Container, Badge, IconButton } from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { useState } from 'react';

export default function Layout() {
    const { logout, user, isAuthenticated } = useAuth();
    const { items } = useCart();
    const [cartOpen, setCartOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <LocalCafeIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={RouterLink} to="/">
                        All The Beans
                    </Typography>

                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/orders">My Orders</Button>
                            <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                        </>
                    )}

                    <IconButton color="inherit" sx={{ ml: 2 }} onClick={() => setCartOpen(true)}>
                        <Badge badgeContent={items.reduce((a, b) => a + b.quantity, 0)} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet />
            </Container>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
}