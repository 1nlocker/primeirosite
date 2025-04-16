'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Todo {
  id: string;
  task: string;
  is_complete: boolean;
  inserted_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    fetchUser();

    // Escutar mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Carregar tarefas
  useEffect(() => {
    if (!user) return;

    const fetchTodos = async () => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('inserted_at', { ascending: false });

        if (error) throw error;
        if (data) setTodos(data);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    };

    fetchTodos();

    // Escutar mudanças em tempo real
    const todoSubscription = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          console.log('Mudança recebida:', payload);
          if (payload.eventType === 'INSERT') {
            setTodos((prev) => [payload.new as Todo, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTodos((prev) =>
              prev.map((todo) => (todo.id === payload.new.id ? payload.new as Todo : todo))
            );
          } else if (payload.eventType === 'DELETE') {
            setTodos((prev) => prev.filter((todo) => todo.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(todoSubscription);
    };
  }, [user]);

  // Adicionar tarefa
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    try {
      const { error } = await supabase.from('todos').insert([
        {
          task: newTask,
          user_id: user.id,
        },
      ]);

      if (error) throw error;
      setNewTask('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  // Atualizar status da tarefa
  const toggleComplete = async (id: string, is_complete: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !is_complete })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  // Remover tarefa
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-4">
        Faça login para gerenciar suas tarefas
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Minhas Tarefas</h2>
      
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Adicionar
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="text-gray-500 text-center">Nenhuma tarefa encontrada</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleComplete(todo.id, todo.is_complete)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span
                  className={`${
                    todo.is_complete ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.task}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800"
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 