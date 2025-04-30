import { NextRequest, NextResponse} from 'next/server';
import { auth } from "@/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    const { slug } = await params;
    const url = `${process.env.BACKEND_URL}/api/workspaces/${slug}`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        }
    });

    return response;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();
    const body = await request.json();

    if (!session?.accessToken) {
        return new NextResponse("Não autorizado!", {status: 403})
    }

    const url = `${process.env.BACKEND_URL}/api/workspaces/${(await params).slug}/`
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


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const session = await auth();

    if (!session?.accessToken) {
        return new NextResponse("Não autorizado!", {status: 403})
    }

    const url = `${process.env.BACKEND_URL}/api/workspaces/${(await params).slug}/`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
        },
        method: "DELETE",
    });

    return response;
}