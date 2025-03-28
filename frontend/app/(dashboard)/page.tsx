import React from 'react';
import { auth } from "@/auth";
import { WorkSpace } from '@/schema/WorkSpace';
import WorkspaceClient from '@/components/WorkSpaceClient';


async function GetDataApi(accessToken?: string) {

    const response = await fetch('http://localhost:8000/api/workspaces/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 } // Cache de 1 hora
    });

    if (!response.ok) throw new Error('Falha ao carregar workspaces');
    
    const workspaces: WorkSpace[] = await response.json();
    return workspaces;
}

export default async function WorkSpacePage() {
    const session = await auth();
    const workspaces = await GetDataApi(session?.accessToken);


    return <WorkspaceClient workspaces={workspaces} />;
}
