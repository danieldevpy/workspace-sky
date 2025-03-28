
export interface WorkPage {
    id: number,
    name: string;
    url: string;
    type: string;
    iframeState?: any; // Estado específico do iframe
}

export interface WorkSpace {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    workpages: WorkPage[];
}
