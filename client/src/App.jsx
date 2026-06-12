import React, { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import ConfirmationModal from './components/ConfirmationModal';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    const prevTasks = [...tasks];
    
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      if (!res.ok) throw new Error('Failed to toggle task completion');
      const updatedTask = await res.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error(error);
      setTasks(prevTasks);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (taskToEdit) {
        const res = await fetch(`${API_URL}/tasks/${taskToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === taskToEdit.id ? updatedTask : t));
        setTaskToEdit(null);
      } else {
        const res = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to create task');
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setTaskIdToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskIdToDelete) return;
    const prevTasks = [...tasks];
    
    setTasks(tasks.filter(t => t.id !== taskIdToDelete));
    setIsConfirmOpen(false);

    try {
      const res = await fetch(`${API_URL}/tasks/${taskIdToDelete}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTaskIdToDelete(null);
    } catch (error) {
      console.error(error);
      setTasks(prevTasks);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const isSearchOrFilterActive = filter !== 'all' || searchQuery.trim() !== '';
    if (isSearchOrFilterActive) {
      alert("Reordering is only supported when viewing 'All' tasks and search is empty.");
      return;
    }

    const reorderedTasks = [...tasks];
    const [draggedItem] = reorderedTasks.splice(draggedIndex, 1);
    reorderedTasks.splice(dropIndex, 0, draggedItem);
    
    setTasks(reorderedTasks);

    try {
      const res = await fetch(`${API_URL}/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: reorderedTasks.map(t => t.id) })
      });
      if (!res.ok) throw new Error('Failed to save task reordering');
    } catch (error) {
      console.error('Error saving task reordering:', error);
      fetchTasks();
    }
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const activeCount = totalCount - completedCount;
  
  const overdueCount = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed);
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const isSearchOrFilterActive = filter !== 'all' || searchQuery.trim() !== '';

  return (
    <>
      <header>
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h1>FocusTask</h1>
        </div>
        <p className="tagline">Write it down, clear your mind, get it done</p>
      </header>


      <section className="stats-container">
        <div className="stat-card all">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card active">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-card completed">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
        {overdueCount > 0 && (
          <div className="stat-card overdue">
            <span className="stat-label">Overdue</span>
            <span className="stat-value">{overdueCount}</span>
          </div>
        )}
        <div className="progress-bar-container">
          <div className="progress-label-row">
            <span style={{ color: 'var(--text-muted)' }}>Progress Completion</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </section>


      <section className="controls-container">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <button className="add-btn" onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Task
          </button>
        </div>
      </section>


      <main className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              draggedIndex={draggedIndex}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
                <line x1="9" y1="18" x2="11" y2="18"></line>
              </svg>
            </div>
            {isSearchOrFilterActive ? (
              <>
                <h3>No Results Found</h3>
                <p>We couldn't find any tasks matching your filters or search query.</p>
              </>
            ) : (
              <>
                <h3>Start Your Journey</h3>
                <p>You have no tasks scheduled yet. Create your first task to stay organized and productive!</p>
                <button
                  className="add-btn"
                  onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}
                  style={{ marginTop: '0.5rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Your First Task
                </button>
              </>
            )}
          </div>
        )}
      </main>


      <TaskForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setTaskToEdit(null); }}
        onSubmit={handleFormSubmit}
        taskToEdit={taskToEdit}
      />


      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setTaskIdToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
      />
    </>
  );
}
