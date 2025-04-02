'use client';

import React from 'react';
import { WorkSpace } from '@/app/(dashboard)/workspace/schema/WorkSpace';
import ContainerWorkSpace from './ContainerWorkSpace';
import { Box } from '@mui/material';

export default function WorkspaceClient({ workspaces }: { workspaces: WorkSpace[] }) {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2
        }}>
            {workspaces.map(workspace => (
                <ContainerWorkSpace key={workspace.id} workspace={workspace} />
            ))}
        </Box>
    );
}