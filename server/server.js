import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { readTasks, writeTasks } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    const sortedTasks = [...tasks].sort((a, b) => (a.position || 0) - (b.position || 0));
    res.json(sortedTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = await readTasks();

    const positions = tasks.map(t => t.position ?? 0);
    const minPosition = positions.length > 0 ? Math.min(...positions) : 0;
    const position = minPosition - 1;

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      position
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[taskIndex];

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description !== null ? description.trim() : '';
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    tasks[taskIndex] = task;
    await writeTasks(tasks);

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.put('/api/tasks/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array of IDs' });
    }

    const tasks = await readTasks();
    
    const taskMap = new Map(tasks.map(t => [t.id, t]));

    const updatedTasks = [];
    orderedIds.forEach((id, index) => {
      const task = taskMap.get(id);
      if (task) {
        task.position = index;
        updatedTasks.push(task);
        taskMap.delete(id);
      }
    });

    let remainingIndex = orderedIds.length;
    taskMap.forEach(task => {
      task.position = remainingIndex++;
      updatedTasks.push(task);
    });

    await writeTasks(updatedTasks);
    res.json({ message: 'Tasks reordered successfully', count: updatedTasks.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    await writeTasks(tasks);

    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
