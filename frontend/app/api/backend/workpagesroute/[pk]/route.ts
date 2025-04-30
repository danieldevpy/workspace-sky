import { NextRequest, NextResponse} from 'next/server';
import { auth } from "@/auth";


export async function PUT(request: NextRequest, { params }: { params: Promise<{ pk: string }> }) {
    const session = await auth();
    const body = await request.json();

    if (!session?.accessToken) {
        return new NextResponse("Não autorizado!", {status: 403})
    }

    const url = `${process.env.BACKEND_URL}/api/workpages/${(await params).pk}/`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        method: "PUT",
        body: JSON.stringify(body)
    });

    return response;
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ pk: string }> }) {
    const session = await auth();

    if (!session?.accessToken) {
        return new NextResponse("Não autorizado!", {status: 403})
    }

    const url = `${process.env.BACKEND_URL}/api/workpages/${(await params).pk}/`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
        method: "DELETE",
    });

    return response;
}