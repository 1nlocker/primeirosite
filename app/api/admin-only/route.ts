import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/admin';

// Esta rota é um exemplo de como usar a chave de serviço de forma segura
// Em uma aplicação real, você adicionaria autenticação/autorização aqui
export async function GET() {
  try {
    // Usando o cliente admin que tem acesso total, ignorando RLS
    const { data, error } = await supabaseAdmin
      .from('exemplo')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro ao acessar dados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
} 