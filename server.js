import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.listen(5000, () => {
    console.log("Listening on port 5000");
});

app.post('/api/search', async (req, res) => {
  const {genre, lang} = req.body;
  console.log({genre, lang});
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are a movie recommendation assistant.  
              1. Return exactly 5 movies matching the genre “${genre}” in the language “${lang}. The movie should be in the mentioned language but you will give the title and description in english”  
              2. Output a JSON array of objects, where each object has these keys:  
                • title (string)  
                • year (integer)  
                • description (string, max 40 words)  
                • imdb_rating (number, one decimal place)  
              3. Do **not** include any additional text, commentary, or preamble—only the JSON array. `
  });
  console.log(response.text);
  res.status(201).json({
      message: 'Results obtained successfully',
      suggestion: response.text
    });
});

app.get('/api/home', async(req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are a movie recommendation assistant.  
              1. Return exactly 5 movies that have been recently released in the current year. You will give the description and title in english.”  
              2. Output a JSON array of objects, where each object has these keys:  
                • title (string)  
                • year (integer)  
                • description (string, max 40 words)  
                • imdb_rating (number, one decimal place)  
              3. Do **not** include any additional text, commentary, or preamble—only the JSON array. `
  });
  console.log(response.text);
  res.status(201).json({
      message: 'Results obtained successfully',
      suggestion: response.text
    });
});

