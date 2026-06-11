import http from 'http';
import assert from 'assert';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import cors from 'cors';
import { readTasks, writeTasks } from './db.js';

const TEST_DB = [];
await writeTasks(TEST_DB);

const PORT = 5099;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks.sort((a, b) => (a.position || 0) - (b.position || 0)));
});

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  const tasks = await readTasks();
  const newTask = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    position: 0
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  await writeTasks(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = tasks.splice(index, 1)[0];
  await writeTasks(tasks);
  res.json(deleted);
});

const server = app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  runTests();
});

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  try {
    console.log('Running API Integration Tests...');

    console.log('Test 1: Creating a task...');
    const createRes = await request('POST', '/api/tasks', { title: 'Test Task' });
    assert.strictEqual(createRes.statusCode, 201);
    assert.strictEqual(createRes.body.title, 'Test Task');
    assert.strictEqual(createRes.body.completed, false);
    const taskId = createRes.body.id;
    console.log(`✓ Task created with ID: ${taskId}`);

    console.log('Test 2: Fetching all tasks...');
    const getRes = await request('GET', '/api/tasks');
    assert.strictEqual(getRes.statusCode, 200);
    assert.ok(Array.isArray(getRes.body));
    assert.ok(getRes.body.some(t => t.id === taskId));
    console.log('✓ Tasks list retrieved and verified');

    console.log('Test 3: Updating task (marking complete)...');
    const updateRes = await request('PUT', `/api/tasks/${taskId}`, { completed: true });
    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.body.completed, true);
    console.log('✓ Task marked complete successfully');

    console.log('Test 4: Deleting task...');
    const deleteRes = await request('DELETE', `/api/tasks/${taskId}`);
    assert.strictEqual(deleteRes.statusCode, 200);
    
    const verifyGetRes = await request('GET', '/api/tasks');
    assert.ok(!verifyGetRes.body.some(t => t.id === taskId));
    console.log('✓ Task deleted and verified gone');

    console.log('\nAll tests passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    server.close();
  }
}
