const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'auth/failed'}),
    (req, res) => {
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
        res.status(401).json({message: 'no yet log in'})
    }
})

module.exports = router