import { useTodo } from '../context/TodoContext';

export default function StatsBar() {
  const { stats } = useTodo();

  if (!stats) return null;

  return (
    <>
      <div className="stats-bar">
        <div className="stat-card total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Completion Progress</span>
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
            {stats.completionRate}%
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </>
  );
}
