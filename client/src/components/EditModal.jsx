import { useState, useEffect } from 'react';
import { useTodo } from '../context/TodoContext';

export default function EditModal({ todo, onClose }) {
  const { updateTodo } = useTodo();
  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category,
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      setSubmitting(true);
      await updateTodo(todo._id, { ...form, dueDate: form.dueDate || null });
      onClose();
    } catch (_) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Task</h2>
          <button className="action-btn" onClick={onClose} style={{ opacity: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <input
              className="todo-input"
              style={{ width: '100%' }}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              autoFocus
            />
            <textarea
              className="todo-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
            />
            <div className="form-row">
              <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
              <input
                className="form-input-sm"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
              />
              <input
                className="form-input-sm"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || !form.title.trim()}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
