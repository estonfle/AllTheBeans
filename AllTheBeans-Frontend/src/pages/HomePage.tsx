import { useEffect, useState, useRef } from 'react';
import { Grid, TextField, Box, Typography, CircularProgress, Pagination } from '@mui/material';
import type { CoffeeBean } from '../types';
import { beansApi } from '../api/beans';
import BeanCard from '../components/BeanCard';
import BeanDetailDialog from '../components/BeanDetailDialog';

export default function HomePage() {
    const [beans, setBeans] = useState<CoffeeBean[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [botd, setBotd] = useState<CoffeeBean | null>(null);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);

    // 2. Create a Ref to store the timer ID between renders
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const initFetch = async () => {
            try {
                const [pagedData, botdData] = await Promise.all([
                    beansApi.getAll('', 1),
                    beansApi.getBotd()
                ]);
                setBeans(pagedData.items);
                setTotalCount(pagedData.totalCount);
                setBotd(botdData);
            } finally {
                setLoading(false);
            }
        };
        initFetch();
    }, []);

    const handlePageChange = async (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        setLoading(true);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const data = await beansApi.getAll(search, value);
            setBeans(data.items);
            setTotalCount(data.totalCount);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setPage(1);
            setLoading(true);
            try {
                const data = await beansApi.getAll(val, 1);
                setBeans(data.items);
                setTotalCount(data.totalCount);
            } finally {
                setLoading(false);
            }
        }, 500);
    };

    if (loading && !beans.length) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

    const totalPages = Math.ceil(totalCount / 9);

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

            {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
            ) : (
                <Grid container spacing={3}>
                    {beans.map(bean => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={bean.id}>
                            <BeanCard bean={bean} onClick={() => setSelectedBean(bean)} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}

            <BeanDetailDialog
                open={!!selectedBean}
                bean={selectedBean}
                onClose={() => setSelectedBean(null)}
            />
        </>
    );
}