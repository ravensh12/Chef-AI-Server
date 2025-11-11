🍽️ Chef AI Server

Chef AI Server is the backend API for the Chef AI application — an intelligent recipe generator that uses AI models to create custom meal ideas based on user ingredients, preferences, and cuisines.
It powers the communication between the React + Vite frontend and the AI model API (Hugging Face / Mistral).

⚙️ Tech Stack

Node.js + Express.js – RESTful server framework

CORS + Axios – for cross-origin communication with the frontend

dotenv – secure environment variable management

Render – deployment platform for hosting the backend API

Hugging Face / Mistral API – for AI-powered recipe generation

🚀 Features

API endpoints for generating AI-based recipes

Integrates seamlessly with the React frontend

Secure handling of API keys through environment variables

Lightweight Express server optimized for Render deployment

🔧 Setup Instructions
1. Clone the repository
git clone https://github.com/ravensh12/Chef-AI-Server.git
cd Chef-AI-Server

2. Install dependencies
npm install

3. Create a .env file
touch .env


Then add:

PORT=5000
HUGGINGFACE_API_KEY=your_api_key_here

4. Run the server locally
npm start


Server will run on
👉 http://localhost:5000
