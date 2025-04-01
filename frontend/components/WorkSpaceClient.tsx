'use client';

import React from 'react';
import { WorkSpace } from '@/schema/WorkSpace';
import ContainerWorkSpace from './ContainerWorkSpace';
import { Box } from '@mui/material';

export default function WorkspaceClient({ workspaces }: { workspaces: WorkSpace[] }) {
    // Obtém a origem no lado do cliente sem a porta

    // const host = typeof window !== "undefined" ? window.location.origin.split(":")[0] + "://" + window.location.hostname : "http://localhost";

    // React.useEffect(()=>{
    //     const updatedWorkspaces = workspaces.map(workspace => ({
    //         ...workspace,
    //         image: workspace.image?.replace("http://localhost", host)
    //     }));
    //     setWorkspaces(updatedWorkspaces);
    // }, [])

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