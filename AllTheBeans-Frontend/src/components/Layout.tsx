import { AppBar, Toolbar, Container, Typography, Button } from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { logout, user, isAuthenticated } = useAuth();
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
                            <Typography sx={{ mx: 2 }}>{user?.username}</Typography>
                            <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                        </>
                    )}

                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet />
            </Container>
        </>
    );
}