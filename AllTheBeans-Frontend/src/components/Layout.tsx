import { AppBar, Toolbar, Container, Typography, Button } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

export default function Layout() {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <LocalCafeIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }} component={RouterLink} to="/">
                        All The Beans
                    </Typography>

                    <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                    <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet />
            </Container>
        </>
    );
}