const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'], 
    accessType: 'offline',
    prompt: 'consent'
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'auth/failed'}),
    (req, res) => {
        console.log('登入成功，req.user:', req.user);
        console.log('session:', req.session);
        res.redirect(process.env.CLIENT_URL)
    }
)

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.json({ message: 'logout failure'});
        res.redirect(process.env.CLIENT_URL);
    })
})

router.get('/me', (req, res) => {
    if (req.user) {
        res.json(req.user)
    } else {
        res.status(401).json({message: 'not yet log in'})
    }
})

module.exports = router