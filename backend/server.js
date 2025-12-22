const express = require('express');
const mysql = require('mysql2');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',      
    database: 'hermosoweb_db'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Error:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const HERMOSO_INSTRUCTIONS = `You are the HermosoWeb Sales Executive. Mention plans: Starter (₹1,499), Business (₹3,499), Enterprise (Custom).`;

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite", 
            systemInstruction: HERMOSO_INSTRUCTIONS 
        });
        const result = await model.generateContent(req.body.prompt);
        res.json({ reply: result.response.text() });
    } catch (error) {
        res.status(500).json({ reply: "AI Error: " + error.message });
    }
});

app.post('/submit-form', (req, res) => {
    const { name, email, plan, message } = req.body;
    const sql = "INSERT INTO leads (name, email, plan, message) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, email, plan, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Lead saved successfully!" });
    });
});

app.listen(3000, () => console.log("🚀 Server running on Port 3000"));


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


