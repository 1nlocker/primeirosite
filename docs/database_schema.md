# Esquema do Banco de Dados

## Tabelas

### 1. Usuários (gerenciado pelo Supabase Auth)

O Supabase já gerencia a tabela `auth.users` automaticamente.

### 2. Perfis

Tabela: `profiles`

| Coluna      | Tipo      | Descrição                            |
|-------------|-----------|--------------------------------------|
| id          | uuid      | Chave primária, referencia auth.users|
| updated_at  | timestamp | Data de atualização                  |
| username    | text      | Nome de usuário                      |
| full_name   | text      | Nome completo                        |
| avatar_url  | text      | URL para a imagem de avatar          |
| website     | text      | Site pessoal                         |

### 3. Tarefas

Tabela: `todos`

| Coluna      | Tipo      | Descrição                            |
|-------------|-----------|--------------------------------------|
| id          | uuid      | Chave primária                       |
| user_id     | uuid      | ID do usuário (FK para auth.users)   |
| task        | text      | Descrição da tarefa                  |
| is_complete | boolean   | Status de conclusão                  |
| inserted_at | timestamp | Data de criação                      |
| updated_at  | timestamp | Data de atualização                  |

## Políticas de RLS

### Perfis
- Leitura: Qualquer pessoa pode ler perfis
- Criação: Apenas usuários autenticados podem criar seus próprios perfis
- Atualização: Usuários só podem atualizar seus próprios perfis
- Exclusão: Usuários só podem excluir seus próprios perfis

### Tarefas
- Leitura: Usuários só podem ver suas próprias tarefas
- Criação: Usuários só podem criar tarefas para si mesmos
- Atualização: Usuários só podem atualizar suas próprias tarefas
- Exclusão: Usuários só podem excluir suas próprias tarefas 