import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authApi.login({ email, password });
            login(data.token, data.email);
            navigate('/');
        } catch (err) { /* Handled globally */ }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>Sign In</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Email" margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth label="Password" type="password" margin="normal" required value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
                    <Link component={RouterLink} to="/register" variant="body2">Don't have an account? Register</Link>
                </Box>
            </Paper>
        </Container>
    );
}