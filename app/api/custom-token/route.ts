import { NextRequest, NextResponse } from 'next/server';
import { createJwt, verifyJwt } from '@/lib/jwt';

// Este endpoint é apenas um exemplo de como criar e verificar JWTs personalizados
// Em uma aplicação real, você adicionaria autenticação/autorização
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }
    
    // Criar um JWT personalizado com o payload fornecido
    // No Supabase, você pode incluir claims personalizados
    const token = await createJwt({
      sub: userId,
      role: role || 'user',
      // Adicione outros claims personalizados aqui
    });
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar um token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }
    
    const payload = await verifyJwt(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ payload });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 