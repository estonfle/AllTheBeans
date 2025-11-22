import { AppBar, Toolbar, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>

                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Outlet />
            </Container>
        </>
    );
}