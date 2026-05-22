import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, loading, filter, clearCompleted, stats } = useTodo();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {filter === 'completed' ? '🎉' : filter === 'pending' ? '✅' : '📋'}
        </div>
        <h3>
          {filter === 'completed'
            ? 'No completed tasks yet'
            : filter === 'pending'
            ? 'No pending tasks!'
            : 'No tasks here'}
        </h3>
        <p>
          {filter === 'all'
            ? 'Add your first task above to get started.'
            : filter === 'pending'
            ? 'All caught up — great work!'
            : 'Complete some tasks to see them here.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <span className="section-title">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
        {stats?.completed > 0 && filter !== 'pending' && (
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={clearCompleted}>
            Clear completed
          </button>
        )}
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
