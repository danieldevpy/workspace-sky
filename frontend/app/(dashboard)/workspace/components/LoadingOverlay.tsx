'use client';

import { CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1400,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.primary' }}>
          Carregando WorkPage...
        </Typography>
      </Box>
    </Box>
  );
};