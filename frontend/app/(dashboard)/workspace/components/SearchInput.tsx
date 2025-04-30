// SearchInput.tsx
'use client';
import React, { ChangeEvent } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Pesquisar...',
  label,
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        variant="outlined"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  edge="end"
                  onClick={handleClear}
                  size="small"
                  aria-label="Limpar pesquisa"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: 'background.paper',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            '&.Mui-focused': {
              backgroundColor: 'background.paper',
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            },
          },
        }}
      />
    </Box>
  );
}