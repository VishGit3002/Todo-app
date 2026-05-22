import { Toaster } from 'react-hot-toast';
import { TodoProvider } from './context/TodoContext';
import StatsBar from './components/StatsBar';
import AddTodoForm from './components/AddTodoForm';
import FilterControls from './components/FilterControls';
import TodoList from './components/TodoList';

function App() {
  return (
    <TodoProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e2a',
            color: '#f0f0f8',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
        }}
      />

      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <div className="logo-icon">✓</div>
            <span className="logo-text">Task<span>o</span></span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Stay organized. Ship it.
          </span>
        </header>

        <StatsBar />
        <AddTodoForm />
        <FilterControls />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App;
