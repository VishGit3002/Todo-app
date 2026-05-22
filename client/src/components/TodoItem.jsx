import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import EditModal from './EditModal';
import { format, isPast, parseISO } from 'date-fns';

export default function TodoItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodo();
  const [editing, setEditing] = useState(false);

  const isOverdue = todo.dueDate && !todo.completed && isPast(parseISO(todo.dueDate));

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <>
      <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
        <div
          className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
          onClick={() => toggleTodo(todo._id)}
          role="checkbox"
          aria-checked={todo.completed}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleTodo(todo._id)}
        />

        <div className="todo-content">
          <div className="todo-title-row">
            <span className="todo-title">{todo.title}</span>
            <span className={`priority-badge priority-${todo.priority}`}>
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}

          <div className="todo-meta">
            {todo.category && todo.category !== 'General' && (
              <span className="todo-meta-item">
                <span className="category-chip">📁 {todo.category}</span>
              </span>
            )}
            {todo.dueDate && (
              <span className={`todo-meta-item ${isOverdue ? 'overdue-text' : ''}`}>
                {isOverdue ? '⚠️' : '📅'} {formatDate(todo.dueDate)}
                {isOverdue && ' · Overdue'}
              </span>
            )}
            <span className="todo-meta-item">
              🕐 {format(parseISO(todo.createdAt), 'MMM d')}
            </span>
          </div>
        </div>

        <div className="todo-actions">
          <button
            className="action-btn edit"
            onClick={() => setEditing(true)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="action-btn delete"
            onClick={() => deleteTodo(todo._id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {editing && <EditModal todo={todo} onClose={() => setEditing(false)} />}
    </>
  );
}
