import { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import type { CoffeeBean } from '../types';
import { beansApi } from '../api/beans';
import BeanCard from '../components/BeanCard';

export default function HomePage() {
    const [beans, setBeans] = useState<CoffeeBean[]>([]);
    const [botd, setBotd] = useState<CoffeeBean | null>(null);
    const [loading, setLoading] = useState(true);

    // Popup State
    const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allBeans, botdData] = await Promise.all([
                    beansApi.getAll(),
                    beansApi.getBotd()
                ]);
                setBeans(allBeans);
                setBotd(botdData);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

    return (
        <>
            <Box mb={4} textAlign="center">
                <Typography variant="h3" gutterBottom color="primary">All The Beans</Typography>
                {botd && (
                    <Box display="flex" justifyContent="center" mb={4}>
                        <Box maxWidth={400} width="100%">
                            <BeanCard bean={botd} isBotd onClick={() => setSelectedBean(botd)} />
                        </Box>
                    </Box>
                )}
            </Box>

            <Grid container spacing={3}>
                {beans.map(bean => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bean.id}>
                        <BeanCard bean={bean} onClick={() => setSelectedBean(bean)} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}