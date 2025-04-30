import { WorkSpace } from "../schema/WorkSpace";


interface RegisterProps {
    name: string;
    description: string;
}


export async function ApiRegisterWorkSpace(register: RegisterProps): Promise<WorkSpace>  {
    const response = await fetch('/api/backend/workspaceroute', {
        method: "POST",
        body: JSON.stringify(register)
    })
    if (response.ok) {
        const workspace: WorkSpace = await response.json();
        return workspace
    }
    throw new Error("Algum erro ao tentar criar o workspace!")
}

export async function ApiEditWorkSpace(workspace: WorkSpace): Promise<WorkSpace>  {
    const response = await fetch(`/api/backend/workspaceroute/${workspace.slug}`, {
        method: "PUT",
        body: JSON.stringify(workspace)
    })
    if (response.ok) {
        const workspace: WorkSpace = await response.json();
        return workspace
    }
    throw new Error("Algum erro ao tentar criar o workspace!");
}

export async function ApiDeleteWorkSpace(workspace: WorkSpace)  {
    const response = await fetch(`/api/backend/workspaceroute/${workspace.slug}`, {
        method: "DELETE",
    })
    if (response.ok) {
        return response;
    }
    throw new Error("Algum erro ao tentar criar o workspace!");
}
