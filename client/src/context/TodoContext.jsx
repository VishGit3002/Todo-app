import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { todoAPI } from '../utils/api';
import toast from 'react-hot-toast';

const TodoContext = createContext();

export const useTodo = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodo must be inside TodoProvider');
  return ctx;
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | completed
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const params = { sortBy, order: 'desc' };
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      if (priority) params.priority = priority;

      const [todosRes, statsRes] = await Promise.all([
        todoAPI.getAll(params),
        todoAPI.getStats(),
      ]);
      setTodos(todosRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [filter, search, priority, sortBy]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data) => {
    try {
      const res = await todoAPI.create(data);
      await fetchTodos();
      toast.success('Task added!');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add task');
      throw err;
    }
  };

  const updateTodo = async (id, data) => {
    try {
      const res = await todoAPI.update(id, data);
      await fetchTodos();
      toast.success('Task updated!');
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const toggleTodo = async (id) => {
    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
      await todoAPI.toggle(id);
      await fetchTodos();
    } catch (err) {
      toast.error('Failed to update task');
      await fetchTodos(); // revert
    }
  };

  const deleteTodo = async (id) => {
    try {
      setTodos((prev) => prev.filter((t) => t._id !== id));
      await todoAPI.delete(id);
      await fetchTodos();
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
      await fetchTodos();
    }
  };

  const clearCompleted = async () => {
    try {
      await todoAPI.clearCompleted();
      await fetchTodos();
      toast.success('Cleared completed tasks');
    } catch (err) {
      toast.error('Failed to clear tasks');
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        stats,
        loading,
        filter, setFilter,
        search, setSearch,
        priority, setPriority,
        sortBy, setSortBy,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        clearCompleted,
        refetch: fetchTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
