'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import { WorkPage } from '@/schema/WorkSpace';
import Lousa from './Lousa';

interface EmbedWorkPageModalProps {
  open: boolean;
  workpages: WorkPage[];
  handleClose: () => void;
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
  updatedUrls: Record<number, string>;
  handleUpdateUrl: (pageId: number, newUrl: string) => void;
}

function EmbedWorkPage({
  open,
  workpages,
  handleClose,
  activePageId,
  setActivePageId,
  updatedUrls,
  handleUpdateUrl,
}: EmbedWorkPageModalProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const loadedUrls = useRef<Record<number, string>>({});
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);
  const [showLousa, setShowLousa] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Record<string, boolean>>({});
  const activePageIdRef = useRef(activePageId);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Corrigido: adicionado activePageId como dependência
  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  // Corrigido: adicionado updatedUrls como dependência
  useEffect(() => {
    loadedUrls.current = { ...updatedUrls };
  }, [updatedUrls]);

  // Corrigido: adicionado open, activePageId e loadedPages como dependências
  useEffect(() => {
    if (open && activePageId) {
      if (loadedPages[activePageId]) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 10000);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, activePageId, loadedPages]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false,
      });
      
      mediaStream.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        recordedChunks.current = [];
      };

      recorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Screen sharing is required to start recording');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    setIsRecording(false);
  }, []);

  // Corrigido: adicionado isRecording e stopRecording como dependências
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  // Corrigido: adicionado activePageId e workpages como dependências
  const handleReload = useCallback(() => {
    if (!activePageId) return;
    const iframe = iframeRefs.current[activePageId];
    if (iframe) {
      setLoadedPages(prev => ({ ...prev, [activePageId]: false }));
      setIsLoading(true);
      iframe.src = loadedUrls.current[Number(activePageId)] || workpages.find(p => String(p.id) === activePageId)?.url || '';
    }
  }, [activePageId, workpages]);

  // Corrigido: adicionado activePageId como dependência
  const handleBack = useCallback(() => {
    if (!activePageId) return;
    const iframe = iframeRefs.current[activePageId];
    try {
      iframe?.contentWindow?.history.back();
    } catch (error) {
      console.error('Cannot go back:', error);
    }
  }, [activePageId]);

  // Corrigido: adicionado activePageId como dependência
  const handleForward = useCallback(() => {
    if (!activePageId) return;
    const iframe = iframeRefs.current[activePageId];
    try {
      iframe?.contentWindow?.history.forward();
    } catch (error) {
      console.error('Cannot go forward:', error);
    }
  }, [activePageId]);

  const getIframeUrl = (pageId: number) => {
    return loadedUrls.current[pageId] || workpages.find(p => p.id === pageId)?.url || '';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: 'background.paper',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
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
          )}

          {/* Header Controls */}
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              top: 16,
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
              aria-label="toggle-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{ color: 'text.secondary' }}
            >
              {menuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

            <IconButton 
              onClick={handleBack} 
              sx={{ color: 'text.secondary' }}
              disabled={!activePageId}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton 
              onClick={handleForward} 
              sx={{ color: 'text.secondary' }}
              disabled={!activePageId}
            >
              <ArrowForwardIcon />
            </IconButton>
            <IconButton 
              onClick={handleReload} 
              sx={{ color: 'text.secondary' }}
              disabled={!activePageId}
            >
              <RefreshIcon />
            </IconButton>
            
            <IconButton
              onClick={isRecording ? stopRecording : startRecording}
              sx={{ color: isRecording ? 'error.main' : 'text.secondary' }}
            >
              {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
            </IconButton>
          </Box>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'text.secondary',
              zIndex: 1300,
              backgroundColor: 'background.paper',
              borderRadius: 4,
              p: 1,
              boxShadow: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Sidebar */}
          <Box
            sx={{
              width: menuOpen ? 240 : 0,
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <List sx={{ width: 240, marginTop: 10 }}>
              {workpages.map(workpage => (
                <ListItem key={workpage.id}>
                  <ListItemButton
                    selected={String(workpage.id) === activePageId}
                    onClick={() => {
                      setActivePageId(String(workpage.id));
                      if (!loadedPages[String(workpage.id)]) {
                        setIsLoading(true);
                      }
                    }}
                  >
                    <ListItemText primary={workpage.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content */}
          <Box sx={{
            flexGrow: 1,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {workpages.map(workpage => (
              <Box
                key={workpage.id}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: String(workpage.id) === activePageId ? 'block' : 'none',
                }}
              >
                <iframe
                  ref={el => { 
                    iframeRefs.current[workpage.id] = el;
                    if (el && !el.src) {
                      el.src = getIframeUrl(workpage.id);
                    }
                  }}
                  onLoad={(e) => {
                    const iframe = e.target as HTMLIFrameElement;
                    const workpageId = String(workpage.id);
                    try {
                      const currentUrl = iframe.contentWindow?.location.href || iframe.src;
                      if (currentUrl !== workpage.url) {
                        handleUpdateUrl(workpage.id, currentUrl);
                      }
                    } catch (error) {
                      // Ignora erros de cross-origin
                    }
                    setLoadedPages(prev => ({ ...prev, [workpageId]: true }));
                    if (activePageIdRef.current === workpageId) {
                      setIsLoading(false);
                      if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  title={workpage.name}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default EmbedWorkPage;