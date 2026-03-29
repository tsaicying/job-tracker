const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk').default;
const { isAuthenticated } = require('../middleware/auth');

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

router.post('/analyze', isAuthenticated, async (req, res) => {
    try {
        const { emails } = req.body;
        console.log('收到 emails 數量:', emails.length)
        const emailText = emails.map (email => `sender: ${email.from}\n
            subject: ${email.subject}\n snippet: ${email.snippet}`).join(
                '\n\n---\n\n');
        const message = await client.messages.create({
            model: 'claude-opus-4-6',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `Your are an job application tacking assistant. Below
                some job seaking related email. Please analyze every email and
                reply the outcome with JSON format. Please analyze every email
                1. company: company name,
                2. position: job position name (if unknown, return "")
                2. status: status (applied/ interviewing/ offered/ rejected, select one)
                3. summary: brief summary 
                only JSON in response, no other word:
                ${emailText}`
            }]
        })
        const rawText = message.content[0].text;
        const cleanText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const result = JSON.parse(cleanText);
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Claude API error'});
    }
})

module.exports = router;