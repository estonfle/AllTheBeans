import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Box, Typography, CircularProgress } from '@mui/material';
import type { CoffeeBean } from '../types';
import { beansApi } from '../api/beans';
import BeanCard from '../components/BeanCard';
import BeanDetailDialog from '../components/BeanDetailDialog';

export default function HomePage() {
    const [beans, setBeans] = useState<CoffeeBean[]>([]);
    const [botd, setBotd] = useState<CoffeeBean | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);

    // 2. Create a Ref to store the timer ID between renders
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            beansApi.getAll(val).then(setBeans);
        }, 500);
    };

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

            <TextField
                fullWidth label="Search beans..." variant="outlined"
                value={search} onChange={handleSearch} sx={{ mb: 4 }}
            />

            <Grid container spacing={3}>
                {beans.map(bean => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bean.id}>
                        <BeanCard bean={bean} onClick={() => setSelectedBean(bean)} />
                    </Grid>
                ))}
            </Grid>

            <BeanDetailDialog
                open={!!selectedBean}
                bean={selectedBean}
                onClose={() => setSelectedBean(null)}
            />
        </>
    );
}