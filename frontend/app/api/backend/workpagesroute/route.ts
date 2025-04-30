import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";


export async function POST(request: NextRequest) {
    const session = await auth();
    const body = await request.json();

    if (!session?.accessToken) {
        return new NextResponse("Não autorizado!", {status: 403})
    }

    const url = `${process.env.BACKEND_URL}/api/workpages/`
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify(body)
    });

    return response;
}