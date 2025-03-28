import React from 'react';
import { auth } from "@/auth";
import { WorkSpace } from '@/schema/WorkSpace';
import WorkspaceClient from '@/components/WorkSpaceClient';
import { redirect } from 'next/navigation';

async function GetDataApi(accessToken?: string) {
    try {
        const response = await fetch('http://workspace-backend:8000/api/workspaces/', {
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
        return workspaces;
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        // Redireciona para login em caso de erro
        redirect('/api/auth/signin?callbackUrl=/workspace');
    }
}

export default async function WorkSpacePage() {
    const session = await auth();
    
    // Se não houver sessão, redireciona para login
    if (!session?.accessToken) {
        redirect('/api/auth/signin?callbackUrl=/workspace');
    }

    try {
        const workspaces = await GetDataApi(session.accessToken);
        return <WorkspaceClient workspaces={workspaces} />;
    } catch (error) {
        // Se ocorrer qualquer erro, redireciona para login
        redirect('/api/auth/signin?callbackUrl=/workspace');
    }
}