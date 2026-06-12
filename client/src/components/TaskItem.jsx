import React from 'react';

export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  index,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  draggedIndex
}) {
  const isCompleted = task.completed;
  
  const isOverdue = (() => {
    if (isCompleted || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  })();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`task-card ${isCompleted ? 'completed-task' : ''} ${isOverdue ? 'overdue' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
      draggable="true"
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >

      <div className="drag-handle" title="Drag to reorder">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>


      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(task.id, !isCompleted)}
        />
        <span className="custom-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </label>


      <div className="task-info">
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          {isOverdue && <span className="overdue-badge">Overdue</span>}
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {(task.dueDate || task.createdAt) && (
          <div className="task-meta">
            {task.dueDate && (
              <span className="task-date-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Due: {formatDate(task.dueDate)}
              </span>
            )}
            <span className="task-created-at" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>


      <div className="task-actions">
        <button
          className="action-btn"
          onClick={() => onEdit(task)}
          title="Edit Task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
