# PathFinder+ Gemini Chatbot

This directory contains the AI-powered conversational agent for PathFinder+. It integrates Google's Gemini LLMs with MongoDB to provide localized, context-aware career and academic guidance for Sri Lankan students and professionals.

## Core Components

The chatbot consists of two main ways to interact: a REST API for the frontend web application and a CLI for local testing.

1.  **`chat_api.py`**: The FastAPI server entry point. Exposes the `/api/chat` endpoint, handling CORS and request/response formatting for the frontend UI.
2.  **`chat_service.py`**: The core business logic. It configures the Gemini model (`gemma-3-1b-it`), establishes the strict "Senior Academic & Career Advisor" persona, and dynamically fetches live job vacancies and academic courses from MongoDB to inject as RAG (Retrieval-Augmented Generation) context.
3.  **`chatbot.py`**: A standalone Command-Line Interface (CLI) version of the chatbot using `gemini-1.5-flash`, perfect for quickly testing database connections and prompt effectiveness without starting the API server.

## Features

-   **Silent RAG (Retrieval-Augmented Generation)**: Automatically fetches relevant courses and jobs from the `courses` and `jobs` MongoDB collections based on user intent keywords without exposing the underlying database queries to the user.
-   **Localized Persona**: Strictly guided to provide advice tailored to the Sri Lankan landscape, filtering out irrelevant international options unless explicitly requested.
-   **Memory Awareness**: Maintains chat history to provide conversational continuity during the session.

## Setup & Execution

### Prerequisites

Ensure you have your environment variables set up in a `.env` file within this directory:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=pathfinder_plus
```

### Running the API Server

To start the FastAPI server for the Next.js frontend to connect to:

```bash
uvicorn chat_api:app --host 0.0.0.0 --port 8002 --reload
```
The API will be available at `http://localhost:8002/api/chat`.

### Running the CLI Chatbot

To test the chatbot directly in your terminal:

```bash
python chatbot.py
```
Or use the service test entrypoint:
```bash
python chat_service.py
```

## Architecture Note
The system uses `gemma-3-1b-it` in the API service for fast, token-efficient responses suitable for a free-tier environment, while utilizing specific keyword-extraction regex logic to minimize database load when fetching contextual documents.
