"use client"
import React from 'react';
import { WorkSpace } from '@/app/(dashboard)/workspace/schema/WorkSpace';
import WorkspaceClient from '@/app/(dashboard)/workspace/components/WorkSpaceClient';
import { Box, Typography, Divider, Button } from '@mui/material';
import { CrudWorkSpace, CrudWorkSpaceRef } from './workspace/components/CrudWorkSpace';


async function GetWorkSpaces() {
    const response = await fetch('/api/backend/workspaceroute');
    if (response.status == 401 || response.status == 403) {
        window.location.href = '/api/auth/signin?callbackUrl=/'
        return [];
    }
    const workspaces: WorkSpace[] = await response.json();
    workspaces.forEach((workspace)=>{
        workspace.image = workspace.image 
        ? `/api/image-proxy?url=${encodeURIComponent(workspace.image)}` 
        : undefined
    })
    return workspaces
}

export default function DashBoardPage() {
    const [workspaces, setWorkspaces] = React.useState<WorkSpace[]>([]);
    const crudRef = React.useRef<CrudWorkSpaceRef>(null);

    const reload =()=> {
        GetWorkSpaces()
        .then((workspaces)=>{
            return setWorkspaces(workspaces)
        })
        .catch((err)=>{})
    }
    React.useEffect(()=>{
        reload();
    }, [])

    return (
        <Box sx={{
            display: "flex",
            height: "100%",
        }}>
            <Box>

            </Box>
            <Box sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                
            }}>
                <Button
                    onClick={crudRef.current?.RegisterWorkSpace}
                    sx={{alignSelf: "flex-end"}}
                    variant='contained'>Criar novo WorkSpace</Button>
                <Typography variant='h6'>WorkSpaces Recentes</Typography>
                <Divider/>
                <br></br>
                <WorkspaceClient workspaces={workspaces} />
                <CrudWorkSpace ref={crudRef} reload={reload}/>
            </Box>
        </Box>
    );
}

