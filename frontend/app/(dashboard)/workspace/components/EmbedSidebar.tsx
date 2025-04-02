'use client';

import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material';
import { WorkPage } from '@/app/(dashboard)/workspace/schema/WorkSpace';

interface EmbedSidebarProps {
  menuOpen: boolean;
  workpages: WorkPage[];
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
}

export const EmbedSidebar = ({
  menuOpen,
  workpages,
  activePageId,
  setActivePageId,
}: EmbedSidebarProps) => (
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
            onClick={() => setActivePageId(String(workpage.id))}
          >
            <ListItemText primary={workpage.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);