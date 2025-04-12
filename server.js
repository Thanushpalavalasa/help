const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./User');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serves HTML files

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.redirect('/signup');
    }

    if (user.password === password) {
        return res.sendFile(path.join(__dirname, 'result.html'));
    } else {
        return res.send('Invalid credentials. <a href="/login">Try again</a>.');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
        return res.send('User already exists. <a href="/login">Login</a>.');
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
