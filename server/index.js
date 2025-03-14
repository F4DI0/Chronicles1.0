const express = require("express");
const session = require("express-session");
const cors = require('cors');
const { mongoose } = require('./utilities/connection');
const { router: PostsRouter } = require("./routers/posts");
const { router: SignUpRouter } = require("./routers/signup");
const { router: CommentRouter } = require("./routers/comments");
const { router: fileRouter } = require("./routers/file");
const { router: userRouter } = require("./routers/users");
const { router: preferenceRouter } = require("./routers/preference");
const { isLoggedIn } = require('./utilities/isloggedin');
const { getGfsBucketPromise } = require('./utilities/gfbucket');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies and credentials
}));
app.use(session({
  secret: 'thisisapasswordforsessions', // Use a strong, unique secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static('public'));

// Routes
app.use("/posts", PostsRouter);
app.use("/posts", CommentRouter); // Mount CommentRouter under /posts
app.use("/account", SignUpRouter);
app.use("/", fileRouter);
app.use("/users", userRouter);
app.use("/preference", preferenceRouter);

// Testing routes
app.get('/login', async (req, res) => {
  res.render('loginpage');
});

app.get('/createAccount', async (req, res) => {
  res.render('createaccount');
});

app.get('/upload', isLoggedIn, async (req, res) => {
  res.render('uploadpage');
});

app.get('/deletepage', isLoggedIn, async (req, res) => {
  res.render('deletepage');
});

app.get('/following', isLoggedIn, async (req, res) => {
  res.render('following');
});

app.get('/allpost', async (req, res) => {
  res.render('posts');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});