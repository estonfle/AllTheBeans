import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth } from '../types/endpoints/auth/auth';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useTranslation } from "node_modules/react-i18next";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { login } = getAuth();
    const { t } = useTranslation('auth');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login({ email, password });
            loginUser(data.token!, data.email!);
            showNotification(t('welcomeBack'), "success");
            navigate('/');
        } catch (err) { /* Handled globally */ }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                {/* <Typography variant="h5" align="center" gutterBottom>{t('buttons.signin')}</Typography> */}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label={t('email')} margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth label={t('password')} type="password" margin="normal" required value={password} onChange={e => setPassword(e.target.value)} />
                    {/* <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{t('buttons.signin')}</Button> */}
                    <Link component={RouterLink} to="/register" variant="body2">{t('dontHaveAccount')}</Link>
                </Box>
            </Paper>
        </Container>
    );
}