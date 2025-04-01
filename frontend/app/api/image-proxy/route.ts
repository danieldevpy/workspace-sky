import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('URL da imagem não fornecida', { status: 400 });
    }

    try {
        // Busca a imagem do backend
        const response = await fetch(imageUrl, {
            headers: {
                // Se necessário, envie o token de autenticação
                'Authorization': request.headers.get('Authorization') || ''
            }
        });

        if (!response.ok) throw new Error('Falha ao carregar imagem');

        // Retorna a imagem com os headers corretos
        const imageBuffer = await response.arrayBuffer();
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400' // Cache de 1 dia
            }
        });
    } catch (error) {
        return new NextResponse('Erro ao carregar imagem', { status: 500 });
    }
}