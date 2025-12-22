const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const HERMOSO_INSTRUCTIONS = `
You are the "HermosoWeb AI Sales Executive". Your tone is professional, friendly, and you speak in Hinglish.
Your task is to help users select the best website development package. 

Here are the official HermosoWeb Plans:
1. Starter Plan (₹1,499): Includes Single Page Design, Mobile Responsive, SSL Certificate. (Best for personal portfolios).
2. Business Plan (₹3,499): Includes 5 Premium Pages, SEO Ready, WhatsApp Chat Integration, 1 Year Support. (Most Popular).
3. Enterprise Plan (Custom Pricing): Includes Unlimited Pages, E-commerce features, Payment Gateway, Admin Panel.

If someone asks about price, explain these plans clearly. 
If someone asks about other topics, politely redirect them to web development services.
Keep answers short and catchy.
`;

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            systemInstruction: HERMOSO_INSTRUCTIONS 
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ reply: response.text() });

    } catch (error) {
        console.error("AI Error:", error.message);
        
        if (error.message.includes("429")) {
            res.status(429).json({ reply: "Bhai, kaafi zyada traffic hai. 1 minute baad pucho!" });
        } else {
            res.status(500).json({ reply: "Technical Issue: " + error.message });
        }
    }
});

app.listen(3000, () => console.log("🚀 HermosoWeb Sales Agent Live!"));
