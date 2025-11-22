import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authApi.register({ email, username, password });
            navigate('/login');
        } catch (err) { /* Handled globally */ }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>Register</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth label="Email" type="email" margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth label="Username" type="text" margin="normal" required value={username} onChange={e => setUsername(e.target.value)} />
                    <TextField fullWidth label="Password" type="password" margin="normal" required value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
                    <Link component={RouterLink} to="/login" variant="body2">Already have an account? Login</Link>
                </Box>
            </Paper>
        </Container>
    );
}