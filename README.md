# FocusTask — Tactile Stationery Task Manager

FocusTask is a beautiful, personal task manager designed for the **Task Manager App** coding exercise. It blends the simple utility of high-quality notebook stationery with modern web features. Designed with a warm, human-crafted tactile aesthetic, it aims to clear your mind and help you execute tasks without the sterile distraction of typical cybernetic dark modes or complex dashboards. It features parchment/linen styling, elegant typography, drag-and-drop task reordering, statistics trackers, and responsive modal interactions, all backed by an Express JSON database server.

---

## Live Demo Links

* **Live Demo**: [FocusTask Live Web App](https://task-manager-app-nc83.vercel.app/)
* **Code Repository**: [GitHub Repository](https://github.com/vanshpal401/Task-Manager-app)

---

## Tech Stack

### Client
* **React 18.2**: Chosen for component reusability, modular architecture, and native hook-based state management (`useState`, `useEffect`).
* **Vite**: Used as the frontend build tool/bundler to ensure extremely fast Hot Module Replacement (HMR) and optimized client builds.
* **Vanilla CSS**: Leverages custom variables for a custom parchment-inspired design system, serif typography (Lora & Plus Jakarta Sans), and smooth transitions without the overhead or styling constraints of utility frameworks.
* **HTML5 Drag and Drop API**: Native browser API leveraged for lightweight drag-and-drop reordering of task cards.

### Server
* **Node.js & Express**: Provides a fast, asynchronous REST API backend.
* **CORS**: Handles Cross-Origin Resource Sharing, allowing the Vite frontend (`http://localhost:5173`) to communicate with the Express server (`http://localhost:5000`).
* **UUID**: Used to assign cryptographically secure, unique identifiers (`uuidv4`) to newly created tasks.
* **File System (Promises)**: Used via `db.js` (`fs/promises`) for secure transactional JSON file operations.

### Development Utilities
* **Concurrently**: Allows running the frontend and backend servers simultaneously from the project root with a single terminal command.
* **Nodemon**: Auto-restarts the backend server on any code change for an improved developer experience.

---

## How to Run Locally

Ensure you have [Node.js](https://nodejs.org/) installed. You can verify this by running `node -v` in your terminal.

Execute the following commands from your terminal:

1. **Clone the repository and navigate into the directory**:
   ```bash
   git clone https://github.com/vanshpal401/Task-Manager-app.git
   cd Task-Manager-app
   ```

2. **Install all dependencies**:
   Install root dependencies, server dependencies, and client dependencies with a single command:
   ```bash
   npm run install:all
   ```

3. **Start the development servers**:
   Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   * The **Frontend Client** runs on: `http://localhost:5173`
   * The **Backend API Server** runs on: `http://localhost:5000`

4. **Run Server Integration Tests**:
   Navigate to the server directory and execute tests:
   ```bash
   cd server && npm run test
   ```

---

## API Documentation

All endpoints expect and return JSON payloads. The base URL is `http://localhost:5000/api`.

### Endpoints

#### 1. Retrieve All Tasks
* **Method**: `GET`
* **Path**: `/tasks`
* **Request Body**: None
* **Response Shape**: `200 OK`
  ```json
  [
    {
      "id": "e22ea8d5-333e-4632-9cb7-6644f125a2df",
      "title": "Clean workspace",
      "description": "Organize desk and files.",
      "dueDate": "2026-06-15",
      "completed": false,
      "createdAt": "2026-06-12T16:40:00.000Z",
      "position": 0
    }
  ]
  ```

#### 2. Create Task
* **Method**: `POST`
* **Path**: `/tasks`
* **Request Body**:
  ```json
  {
    "title": "Read a book", // Required (non-empty string)
    "description": "Read at least two chapters", // Optional string
    "dueDate": "2026-06-20" // Optional string (YYYY-MM-DD) or null
  }
  ```
* **Response Shape**: `201 Created`
  ```json
  {
    "id": "fd9b1bc1-8935-46df-91bd-3467bf7ea231",
    "title": "Read a book",
    "description": "Read at least two chapters",
    "dueDate": "2026-06-20",
    "completed": false,
    "createdAt": "2026-06-12T16:45:12.345Z",
    "position": -1
  }
  ```
* **Errors**:
  * `400 Bad Request` if `title` is missing/empty: `{"error": "Title is required"}`

#### 3. Update Task
* **Method**: `PUT`
* **Path**: `/tasks/:id`
* **Request Body**: *(All fields are optional)*
  ```json
  {
    "title": "Read a science book",
    "description": "Read three chapters",
    "dueDate": "2026-06-22",
    "completed": true
  }
  ```
* **Response Shape**: `200 OK`
  ```json
  {
    "id": "fd9b1bc1-8935-46df-91bd-3467bf7ea231",
    "title": "Read a science book",
    "description": "Read three chapters",
    "dueDate": "2026-06-22",
    "completed": true,
    "createdAt": "2026-06-12T16:45:12.345Z",
    "position": -1
  }
  ```
* **Errors**:
  * `400 Bad Request` if updating title to empty string: `{"error": "Title cannot be empty"}`
  * `404 Not Found` if task ID does not exist: `{"error": "Task not found"}`

#### 4. Reorder Tasks
* **Method**: `PUT`
* **Path**: `/tasks/reorder`
* **Request Body**:
  ```json
  {
    "orderedIds": ["id1", "id2", "id3"] // Array of task IDs in the new order
  }
  ```
* **Response Shape**: `200 OK`
  ```json
  {
    "message": "Tasks reordered successfully",
    "count": 3
  }
  ```
* **Errors**:
  * `400 Bad Request` if `orderedIds` is not an array: `{"error": "orderedIds must be an array of IDs"}`

#### 5. Delete Task
* **Method**: `DELETE`
* **Path**: `/tasks/:id`
* **Request Body**: None
* **Response Shape**: `200 OK`
  ```json
  {
    "message": "Task deleted successfully",
    "task": {
      "id": "fd9b1bc1-8935-46df-91bd-3467bf7ea231",
      "title": "Read a science book",
      "completed": true
    }
  }
  ```
* **Errors**:
  * `404 Not Found` if task ID does not exist: `{"error": "Task not found"}`

---

## Project Structure

```text
task-manager/
├── package.json              # Monorepo setup & scripts to run server/client concurrently
├── package-lock.json         # Root dependency lockfile
├── README.md                 # Project documentation
├── client/                   # React Frontend App
│   ├── package.json          # Client configurations, scripts, and dependencies
│   ├── index.html            # Main HTML entry point
│   ├── vite.config.js        # Vite build tool setup
│   ├── public/               # Public assets (e.g. favicon)
│   └── src/                  # Client source code
│       ├── main.jsx          # React app entry point
│       ├── App.jsx           # Main React component (stores state, orchestrates client actions)
│       ├── App.css           # App layout styling
│       ├── index.css         # Theme variables (colors, fonts, global design tokens)
│       └── components/       # Reusable components
│           ├── TaskForm.jsx          # Modal form for adding/editing tasks
│           ├── TaskItem.jsx          # Individual task item card
│           └── ConfirmationModal.jsx # Destructive actions verification modal
└── server/                   # Express Backend App
    ├── package.json          # Server configurations, scripts, and dependencies
    ├── server.js             # Main server logic and API routes
    ├── db.js                 # Low-level fs/promises handler for database operations
    ├── db.json               # Flat JSON database (tasks collection)
    └── test.js               # API integration test suite
```

---

## Next Steps

### What was chosen not to do in the initial scope:
1. **Persistent Database Service**: Chose low-maintenance, lightweight local JSON database file storage over setup-intensive PostgreSQL, MySQL, or MongoDB, prioritizing fast deployment.
2. **User Authentication & Tenant Isolation**: Implemented a global task list for simplicity. We omitted account logins, signup/registration pages, and session storage.
3. **Subtasks & Categorization Tags**: Decided against subtask checklists or categories (folders/projects) to keep the initial interface uncluttered and clean.

### Future roadmap/features to build next:
1. **User Accounts & Auth**: Introduce JWT-based authentication (or OAuth) so that each user has their own private, isolated workspace.
2. **Dividers/Folders**: Allow tagging tasks into groups styled visually like classic notebook dividers.
3. **Recurring Task Scheduling**: Implement calendar schedules for tasks that repeat daily, weekly, or monthly.
4. **Offline Mode (PWA)**: Support offline task modification via IndexedDB and automatic server sync when internet reconnects.
5. **Theme Selection**: Add additional stationery palettes (e.g., 'Oxford Blue Ink' or 'Charcoal Slate').
