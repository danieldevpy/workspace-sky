import React from 'react';
import { auth } from "@/auth";
import { WorkSpace } from '@/app/(dashboard)/workspace/schema/WorkSpace';
import WorkspaceClient from '@/app/(dashboard)/workspace/components/WorkSpaceClient';
import { redirect } from 'next/navigation';

async function GetDataApi(accessToken?: string) {

    const response = await fetch(process.env.BACKEND_URL + '/api/workspaces/', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        next: { revalidate: 3600 } // Cache de 1 hora
    });

    if (response.status === 401 || response.status === 403) {
        // Força o redirecionamento para logout ou login
        redirect('/api/auth/signin?callbackUrl=/workspace');
    }

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
