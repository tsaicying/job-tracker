const express = require('express');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();

const passport = require('./config/passport');
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const gmailRouter = require('./routes/gmail');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())

app.use('/api/jobs', jobsRouter);
app.use('/auth',  authRouter);
app.use('/api/gmail', gmailRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Job Tracker is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
