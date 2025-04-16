# Meu Primeiro Site

Este é um projeto Next.js com Supabase para gerenciamento de dados e autenticação.

## Configuração

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie uma conta no [Supabase](https://supabase.com/)
   - Crie um novo projeto no Supabase
   - Copie a URL e a chave anônima do projeto
   - Renomeie o arquivo `.env.local.example` para `.env.local` e adicione suas credenciais:
     ```
     NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
     NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
     ```
4. Execute os scripts SQL em `supabase/migrations` no Editor SQL do Supabase para criar as tabelas e políticas de segurança

## Estrutura do Banco de Dados

O projeto utiliza as seguintes tabelas:

1. **Perfis** (`profiles`) - Informações dos usuários
   - Conectado à tabela `auth.users` do Supabase
   - Inclui dados como nome de usuário, nome completo, avatar, etc.

2. **Tarefas** (`todos`) - Lista de tarefas dos usuários
   - Cada tarefa pertence a um usuário específico
   - Contém descrição, status de conclusão e timestamps

Todas as tabelas estão protegidas com políticas de Row Level Security (RLS) para garantir que os usuários só possam acessar seus próprios dados.

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Funcionalidades

- **Autenticação com Magic Link**: login via email
- **Gestão de Tarefas**: criar, ler, atualizar e excluir tarefas
- **Atualizações em Tempo Real**: observa mudanças nas tarefas usando Realtime do Supabase

## CI/CD

O projeto está configurado com GitHub Actions para:
- Verificar a compilação em cada push ou pull request
- Executar a compilação do Next.js

Para configurar o deploy automático, adicione seus segredos do Supabase como segredos do GitHub:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Tecnologias utilizadas

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- GitHub Actions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
