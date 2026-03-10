import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth } from '@/types/endpoints/auth/auth';
import { useNotification } from '@/context/NotificationContext';
import { useTranslation } from "node_modules/react-i18next";

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const { register } = getAuth();
    const { t } = useTranslation('auth');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ email, username, password });
            showNotification(t('successfulRegistration'), "success");
            navigate('/login');
        } catch (err) { /* Handled globally */ }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>{t('register')}</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label={t('email')} type="email" margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth label={t('userName')} type="text" margin="normal" required value={username} onChange={e => setUsername(e.target.value)} />
                    <TextField fullWidth label={t('password')} type="password" margin="normal" required value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>{t('register')}</Button>
                    <Link component={RouterLink} to="/login" variant="body2">{t('alreadyHaveAccount')}</Link>
                </Box>
            </Paper>
        </Container>
    );
}