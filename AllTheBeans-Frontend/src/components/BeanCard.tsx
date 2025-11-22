import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import type { CoffeeBean } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

interface Props {
    bean: CoffeeBean;
    isBotd?: boolean;
    onClick: () => void; // Opens the popup
}

export default function BeanCard({ bean, isBotd, onClick }: Props) {
    const optimizedImage = getOptimizedImageUrl(bean.image, 400);

    return (
        <Card
            sx={{
                height: '100%', display: 'flex', flexDirection: 'column',
                border: isBotd ? '3px solid gold' : 'none',
                cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(1.02)' }
            }}
            onClick={onClick}
        >
            {isBotd && <Box sx={{ bgcolor: 'gold', textAlign: 'center', py: 0.5, fontWeight: 'bold' }}>🌟 Bean of the Day 🌟</Box>}
            <CardMedia component="img" height="160" image={optimizedImage} alt={bean.name} loading="lazy" />
            <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Typography variant="h6" component="div">{bean.name}</Typography>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">£{bean.cost}</Typography>
                </Box>
                <Box mt={1} display="flex" gap={0.5} flexWrap="wrap">
                    <Chip label={bean.country} size="small" />
                    <Chip label={bean.colour} size="small" variant="outlined" />
                </Box>
            </CardContent>
        </Card>
    );
}