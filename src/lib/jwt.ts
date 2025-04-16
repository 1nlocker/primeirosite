import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';

// IMPORTANTE: Este módulo deve ser usado APENAS em código do servidor
// Nunca deve ser importado em componentes cliente

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

// Converter o segredo base64 para um buffer
const getJwtSecret = async () => {
  const secretBuffer = Buffer.from(JWT_SECRET, 'base64');
  return new TextEncoder().encode(secretBuffer);
};

/**
 * Verifica e decodifica um JWT do Supabase
 * @param token Token JWT para verificar
 * @returns Payload decodificado ou null se inválido
 */
export async function verifyJwt(token: string) {
  try {
    const secret = await getJwtSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Erro ao verificar JWT:', error);
    return null;
  }
}

/**
 * Cria um novo JWT usando o segredo do Supabase
 * @param payload O conteúdo do JWT
 * @param expiresIn Tempo de expiração em segundos (padrão: 1 hora)
 * @returns Token JWT assinado
 */
export async function createJwt(payload: any, expiresIn = 3600) {
  try {
    const secret = await getJwtSecret();
    
    // Adicionar campos padrão do Supabase
    const fullPayload = {
      ...payload,
      iss: 'custom-jwt',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };
    
    const token = await new jose.SignJWT(fullPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(secret);
      
    return token;
  } catch (error) {
    console.error('Erro ao criar JWT:', error);
    throw error;
  }
} 