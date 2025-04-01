'use client';

import React, { useCallback } from 'react';
import {
  IconButton,
  Box,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Refresh,
  FiberManualRecord,
  Stop,
} from '@mui/icons-material';

interface EmbedControlsProps {
  activePageId: string | null;
  handleBack: () => void;
  handleForward: () => void;
  handleReload: () => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  recordingError?: string;
}

export const EmbedControls = ({
  activePageId,
  handleBack,
  handleForward,
  handleReload,
  isRecording,
  startRecording,
  stopRecording,
  recordingError,
}: EmbedControlsProps) => (
  <Box
    sx={{
      position: 'absolute',
      left: 60,
      top: 0,
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      zIndex: 1300,
      backgroundColor: 'background.paper',
      borderRadius: 4,
      p: 1,
      boxShadow: 1,
    }}
  >
    <IconButton 
      onClick={handleBack} 
      sx={{ color: 'text.secondary' }}
      disabled={!activePageId}
    >
      <ArrowBack />
    </IconButton>
    <IconButton 
      onClick={handleForward} 
      sx={{ color: 'text.secondary' }}
      disabled={!activePageId}
    >
      <ArrowForward />
    </IconButton>
    <IconButton 
      onClick={handleReload} 
      sx={{ color: 'text.secondary' }}
      disabled={!activePageId}
    >
      <Refresh />
    </IconButton>
    
    <IconButton
      onClick={isRecording ? stopRecording : startRecording}
      sx={{ color: isRecording ? 'error.main' : 'text.secondary' }}
    >
      {isRecording ? <Stop /> : <FiberManualRecord />}
    </IconButton>
  </Box>
);