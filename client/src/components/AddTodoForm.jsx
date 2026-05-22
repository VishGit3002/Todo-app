import { useState } from 'react';
import { useTodo } from '../context/TodoContext';

const DEFAULT_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'General',
  dueDate: '',
};

export default function AddTodoForm() {
  const { addTodo } = useTodo();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      setSubmitting(true);
      await addTodo({
        ...form,
        dueDate: form.dueDate || null,
      });
      setForm(DEFAULT_FORM);
      setExpanded(false);
    } catch (_) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-todo-section">
      <form onSubmit={handleSubmit}>
        <div className="add-todo-row">
          <input
            className="todo-input"
            name="title"
            value={form.title}
            onChange={handleChange}
            onFocus={() => setExpanded(true)}
            placeholder="Add a new task..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !form.title.trim()}
          >
            {submitting ? '...' : '+ Add'}
          </button>
        </div>

        {expanded && (
          <>
            <textarea
              className="todo-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              style={{ marginBottom: 10 }}
            />
            <div className="form-row">
              <select
                className="form-select"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
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
          </>
        )}
      </form>
    </div>
  );
}
