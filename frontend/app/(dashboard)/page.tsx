import { auth } from "@/auth";
import { redirect } from 'next/navigation';

export default async function WorkSpacePage() {
    const session = await auth();
    
    // Se não houver sessão, redireciona para login
    if (!session?.accessToken) {
        redirect('/api/auth/signin?callbackUrl=/workspace');
    }

    redirect('/workspace');

}