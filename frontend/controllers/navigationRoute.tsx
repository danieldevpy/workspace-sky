
import DashboardIcon from '@mui/icons-material/Dashboard';
import type { Navigation } from '@toolpad/core/AppProvider';
import { auth } from '@/auth';




interface WorkSpaceApiData {
    id: number;
    name: string;
    slug: string;
}

// Modifique a função para receber o token diretamente
export async function MakeNavigationRoute(accessToken: string) {
    try {
        const response = await fetch(process.env.BACKEND_URL + '/api/workspaces/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            next: { revalidate: 3600 } // Cache de 1 hora
        });

        if (!response.ok) throw new Error('Falha ao carregar workspaces');

        const workspaces: WorkSpaceApiData[] = await response.json();

        return [
            { kind: 'header', title: 'Inicio' },
            { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
            { kind: 'header', title: 'WorkSpace' },
            ...workspaces.map((workspace) => ({
                segment: `workspace/${workspace.slug}`, // Use ID para URLs estáveis
                title: workspace.name,
                icon: <DashboardIcon />,
            }))
        ] as Navigation;
    } catch (error) {
        console.error('Erro na geração de rotas:', error);
        return []; // Fallback seguro
    }
}