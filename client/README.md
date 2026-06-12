# FocusTask

FocusTask is a beautiful, personal task manager that blends the simple utility of high-quality notebook stationery with modern web features. Designed with a warm, human-crafted tactile aesthetic, it aims to clear your mind and help you execute tasks without the sterile distraction of cybernetic dark modes or complex AI panels.

---

## Design Philosophy

- **Tactile Parchment Aesthetic**: Employs a soft parchment/linen color scheme (`#faf6f0`), deep charcoal ink typography, and organic earth tones like warm terracotta clay and forest sage.
- **Premium Serif Pairings**: Features *Lora* for editorial typography and *Plus Jakarta Sans* for precise, clean task details.
- **Stationery Focus**: No glowing shadows or neon buttons. Subtle borders and realistic card-lift elevations create a calm, tactile canvas.
- **Zero Legibility Noise**: The codebase and stylesheets are entirely comment-free for maximum clarity and lightweight production builds.

---

## Features

- **Stats Pinned Dashboard**: A set of catalog-like dashboard cards displaying Total, Active, Completed, and Overdue tasks alongside a clean progress completion bar.
- **Tactile Drag-and-Drop**: Easily reorder your schedule by dragging task handles.
- **Dynamic Filters**: Seamlessly filter tasks by *All*, *Active*, and *Completed*, or find matching tasks with search querying.
- **Smart Overdue Tracker**: Automatically marks active tasks with overdue badges if their scheduled dates are prior to today.
- **Snappy Optimistic Updates**: Delivers immediate state changes on task completion or deletion, with automatic server fallback rollback logic.

---

## Technology Stack

- **Client**: React (18.2), Vite, Vanilla CSS.
- **Server**: Node.js, Express, Local JSON Database storage.

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Setup Instructions

1. **Install Dependencies**:
   Install all dependencies for both the client and server at once from the root directory:
   ```bash
   npm run install:all
   ```

2. **Start Development Servers**:
   Run both servers concurrently:
   ```bash
   npm run dev
   ```
   - Client runs on the default Vite port (e.g., `http://localhost:5173`).
   - Server runs on `http://localhost:5000`.

3. **Running Server Tests**:
   To run API integration validation tests, execute from the `server` directory:
   ```bash
   npm run test
   ```
