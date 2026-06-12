import React, { useState, useEffect } from 'react';

export default function TaskForm({ isOpen, onClose, onSubmit, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      if (taskToEdit.dueDate) {
        setDueDate(taskToEdit.dueDate.substring(0, 10));
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{taskToEdit ? 'Edit Task' : 'Add Task'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                type="text"
                className="form-input"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                autoFocus
              />
              {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{error}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="form-textarea"
                placeholder="Enter task description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-duedate">Due Date</label>
              <input
                id="task-duedate"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="add-btn">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
