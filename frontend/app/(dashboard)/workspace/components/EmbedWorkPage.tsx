'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { WorkPage } from '@/app/(dashboard)/workspace/schema/WorkSpace';
import { EmbedControls } from './EmbedControls';
import { EmbedSidebar } from './EmbedSidebar';
import { LoadingOverlay } from './LoadingOverlay';
import { EmbedWorkPageModalProps } from './types';
import { useScreenRecorder } from './useScreenRecorder';


export const EmbedWorkPage = ({
  open,
  workpages,
  handleClose,
  activePageId,
  setActivePageId,
  updatedUrls,
  handleUpdateUrl,
}: EmbedWorkPageModalProps) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const loadedUrls = useRef<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Record<string, boolean>>({});
  const activePageIdRef = useRef(activePageId);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingError,
    clearError
  } = useScreenRecorder();

  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  useEffect(() => {
    loadedUrls.current = { ...updatedUrls };
  }, [updatedUrls]);

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

  const handleReload = useCallback(() => {
    if (!activePageId) return;
    const iframe = iframeRefs.current[activePageId];
    if (iframe) {
      setLoadedPages(prev => ({ ...prev, [activePageId]: false }));
      setIsLoading(true);
      iframe.src = loadedUrls.current[Number(activePageId)] || workpages.find(p => String(p.id) === activePageId)?.url || '';
    }
  }, [activePageId, workpages]);

  const handleBack = useCallback(() => {
    if (!activePageId) return;
    const iframe = iframeRefs.current[activePageId];
    try {
      iframe?.contentWindow?.history.back();
    } catch (error) {
      console.error('Cannot go back:', error);
    }
  }, [activePageId]);

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
        <Box sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.paper',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <LoadingOverlay isLoading={isLoading} />

          {recordingError && (
                <Box
                    sx={{
                    position: 'fixed',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'error.main',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                    }}
                >
                    <Typography variant="body2">{recordingError}</Typography>
                    <IconButton size="small" onClick={clearError} sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                )}

          <Box sx={{
            position: 'absolute',
            left: 16,
            top: 16,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            zIndex: 1300,
          }}>
            <IconButton
              aria-label="toggle-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              sx={{ 
                color: 'text.secondary',
                backgroundColor: 'background.paper',
                borderRadius: 4,
                p: 1,
                boxShadow: 1,
              }}
            >
              {menuOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>

            <EmbedControls
              activePageId={activePageId}
              handleBack={handleBack}
              handleForward={handleForward}
              handleReload={handleReload}
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
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

          <EmbedSidebar
            menuOpen={menuOpen}
            workpages={workpages}
            activePageId={activePageId}
            setActivePageId={setActivePageId}
          />

          <Box sx={{
            flexGrow: 1,
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            transition: 'margin-left 0.3s ease'
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
};