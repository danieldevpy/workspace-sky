import React from 'react';
import { auth } from "@/auth";
import { WorkSpace } from '@/schema/WorkSpace';
import WorkspaceClient from '@/components/WorkSpaceClient';


async function GetDataApi(accessToken?: string) {

    const response = await fetch(process.env.BACKEND_URL + '/api/workspaces/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 } // Cache de 1 hora
    });

    if (!response.ok) throw new Error('Falha ao carregar workspaces');
    
    const workspaces: WorkSpace[] = await response.json();
    workspaces.forEach((workspace)=>{
        workspace.image = workspace.image 
        ? `/api/image-proxy?url=${encodeURIComponent(workspace.image)}` 
        : undefined
    })

    return workspaces;
}

export default async function WorkSpacePage() {
    const session = await auth();
    const workspaces = await GetDataApi(session?.accessToken);


    return <WorkspaceClient workspaces={workspaces} />;
}
