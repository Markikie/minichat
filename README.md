# Mini Chat App with Ollama

A simple web-based chat interface where users can send messages and receive responses from an AI model running via Ollama.

## Architecture

This application follows a **layered architecture** pattern:

- **Presentation Layer**: Controllers and Routes (handle HTTP requests/responses)
- **Service Layer**: Business logic (MessageService, OllamaService)
- **Data Access Layer**: Repositories (MongoDB operations)
- **Model Layer**: Entities and Schemas (Mongoose models)

## Tech Stack

- **Frontend**: Next.js 14 (TypeScript, React)
- **Backend**: Node.js + Express (TypeScript)
- **Database**: MongoDB (via Docker)
- **LLM Backend**: Ollama (via HTTP API)
- **Styling**: Tailwind CSS
- **Monorepo**: npm workspaces

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (for MongoDB)
- **Ollama** (for AI model)

## Setup Instructions

### 1. Clone and Install Dependencies

This project uses **npm workspaces** (monorepo). Install all dependencies from the root:

```bash
# Install all dependencies (backend + frontend)
npm install
```

This will automatically install dependencies for both `backend` and `frontend` workspaces.

### 2. Set Up MongoDB with Docker

Start MongoDB using Docker Compose:

```bash
# From the root directory
docker-compose up -d
```

This will:
- Pull the latest MongoDB image from Docker Hub
- Start MongoDB container on port 27017
- Create a persistent volume for data storage

Verify MongoDB is running:
```bash
docker ps
```

You should see the `shout-together-mongodb` container running.

### 3. Set Up Ollama

#### Install Ollama

**Windows:**
- Download from [https://ollama.ai](https://ollama.ai)
- Run the installer

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Pull the Model

After installing Ollama, pull the `llama3` model:

```bash
ollama pull llama3
```

This will download the model (may take several minutes depending on your internet connection).

#### Start Ollama Service

**Windows/macOS:**
- Ollama runs as a service automatically after installation
- Verify it's running by checking `http://localhost:11434` in your browser

**Linux:**
```bash
# Start Ollama service
ollama serve
```

#### Verify Ollama is Running

Test the Ollama API:

```bash
curl http://localhost:11434/api/tags
```

You should see a list of available models including `llama3`.

### 4. Configure Environment Variables

#### Backend Environment Variables

Copy the example file and create your `.env` file:

```bash
cd backend
cp .env.example .env
```

Or manually create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shout-together
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment Variables

Copy the example file and create your `.env.local` file:

```bash
cd frontend
cp .env.example .env.local
```

Or manually create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** The `.env.example` files are provided as templates. Make sure to create your actual `.env` and `.env.local` files (these are gitignored and won't be committed).

## Running the Application

### 1. Start MongoDB (if not already running)

```bash
docker-compose up -d
```

### 2. Start Both Servers (Recommended)

Run both backend and frontend together:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend server on `http://localhost:3000`

### 3. Start Servers Separately (Optional)

If you prefer to run them separately:

**Backend:**
```bash
npm run dev:backend
```

**Frontend:**
```bash
npm run dev:frontend
```

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### POST `/api/messages`
Send a message and get AI response.

**Request:**
```json
{
  "content": "Hello, how are you?"
}
```

**Response:**
```json
{
  "role": "ai",
  "content": "Hello! I'm doing well, thank you for asking...",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

### GET `/api/messages`
Get all chat messages.

**Response:**
```json
[
  {
    "role": "user",
    "content": "Hello",
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  {
    "role": "ai",
    "content": "Hello! How can I help?",
    "createdAt": "2024-01-01T12:00:01.000Z"
  }
]
```

### DELETE `/api/messages`
Clear all chat messages.

**Response:**
```json
{
  "message": "All messages cleared successfully"
}
```

## Features

-  Chat interface with user and AI message bubbles
-  Message persistence in MongoDB
-  Loading indicator while AI is responding
-  Error handling and display
-  Input validation (max 500 characters)
-  Auto-scroll to newest message
-  Clear chat button
-  Schema designed for future multi-session support

## Troubleshooting

### MongoDB Connection Issues

**Problem**: Backend can't connect to MongoDB

**Solutions**:
1. Verify Docker container is running: `docker ps`
2. Check MongoDB logs: `docker logs shout-together-mongodb`
3. Verify connection string in `.env`: `mongodb://localhost:27017/shout-together`
4. Restart MongoDB: `docker-compose restart`

### Ollama Not Responding

**Problem**: "Ollama service is not running" error

**Solutions**:
1. Verify Ollama is running: `curl http://localhost:11434/api/tags`
2. Start Ollama service:
   - Windows/macOS: Restart the Ollama application
   - Linux: Run `ollama serve`
3. Verify the model is downloaded: `ollama list`
4. If model is missing, pull it: `ollama pull llama3`

### Model Not Found

**Problem**: "Model 'llama3' not found" error

**Solution**:
```bash
ollama pull llama3
```

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL (default: `http://localhost:3000`)
2. Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local` matches backend URL (default: `http://localhost:3001`)
3. Restart both servers after changing environment variables

### Port Already in Use

**Problem**: Port 3000, 3001, or 27017 is already in use

**Solutions**:
1. Change the port in environment variables
2. Stop the process using the port:
   - Windows: `netstat -ano | findstr :PORT` then `taskkill /PID <PID> /F`
   - macOS/Linux: `lsof -ti:PORT | xargs kill`

## Project Structure

```
shout-together/
├── backend/
│   ├── src/
│   │   ├── presentation/     # Controllers & Routes
│   │   ├── service/          # Business Logic
│   │   ├── repository/       # Data Access
│   │   ├── models/           # Mongoose Models
│   │   ├── config/           # Configuration
│   │   └── types/            # TypeScript Types
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React Components
│   │   └── lib/              # Utilities
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Development

### Monorepo Scripts

All scripts can be run from the root directory:

```bash
# Run both backend and frontend in development mode
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend

# Build all workspaces
npm run build

# Build only backend
npm run build:backend

# Build only frontend
npm run build:frontend
```

### Building for Production

**Build all:**
```bash
npm run build
```

**Build and run individually:**

Backend:
```bash
npm run build:backend
npm run start --workspace=backend
```

Frontend:
```bash
npm run build:frontend
npm run start --workspace=frontend
```

## License

ISC

