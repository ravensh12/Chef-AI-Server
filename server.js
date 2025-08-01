// server.js
import express from 'express';
import cors from 'cors';
import { HfInference } from '@huggingface/inference';

// Load environment variables. In production, these should be set
// directly in the hosting environment's configuration.
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow the React client to make requests to this server
app.use(cors());
app.use(express.json());

// Log the environment variable to confirm it's being loaded
const hfAccessToken = process.env.HF_ACCESS_TOKEN;
console.log("HF_ACCESS_TOKEN loaded:", hfAccessToken ? "Yes" : "No");

if (!hfAccessToken) {
    console.error("Critical: HF_ACCESS_TOKEN is not set. Please check your .env file in the server directory.");
    // This will prevent the server from starting if the key is missing.
    process.exit(1);
}

// The Hugging Face API client, initialized with a securely stored API key
const hf = new HfInference(hfAccessToken);

// API endpoint to generate a recipe.
app.post('/api/generate-recipe', async (req, res) => {
    // This is the prompt that will be sent to the AI
    const SYSTEM_PROMPT = `
        You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
    `;

    try {
        const { ingredients } = req.body;
        console.log("Received ingredients:", ingredients);

        // Make the API call to Hugging Face
        console.log("Attempting to call Hugging Face API...");
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredients.join(", ")}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });
        console.log("Hugging Face API call successful.");

        if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
            // Send the AI's response back to the client
            res.json({ recipe: response.choices[0].message.content });
        } else {
            console.error("AI returned an unexpected structure:", response);
            res.status(500).json({ error: "AI returned an unexpected response." });
        }
    } catch (error) {
        // Log the full error object for detailed debugging
        console.error("Error generating recipe. The error is:", JSON.stringify(error, null, 2));
        res.status(500).json({ error: "Failed to generate recipe. Please try again." });
    }
});

// The server now listens for requests on a specific port.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
