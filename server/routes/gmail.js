const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { isAuthenticated } = require('../middleware/auth');

router.get('/emails', isAuthenticated, async (req, res) => {
    try{
        const auth = new google.auth.OAuth2()
        auth.setCredentials( {access_token: req.user.access_token });

        const gmail = google.gmail( { version: 'v1', auth });

        const response = await gmail.users.messages.list({
            userId: 'me',
            q: 'subject:(application OR interview OR offer OR rejection OR hiring)',
            maxResults: 20
        })
        
        const messages = response.data.messages || [];

        if (messages.length === 0){
            return res.json([])
        }

        const emails = await Promise.all(
            messages.map(async (msg) => {
                const detail = await gmail.users.messages.get({
                    userId: 'me',
                    id: msg.id,
                    format: 'metadata',
                    metadataHeaders: ['Subject', 'From', 'Date']
                })

                const headers = detail.data.payload.headers;
                const subject = headers.find(h => h.name === 'Subject')?.value || '';
                const from = headers.find(h => h.name === 'From')?.value || '';
                const date = headers.find(h => h.name === 'Date')?.value || '';
                const snippet = detail.data.snippet || '';

                return { id: msg.id, subject, from, date, snippet };
            })
        
        )

        res.json(emails)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gmail API failure'})
    }
})

module.exports = router