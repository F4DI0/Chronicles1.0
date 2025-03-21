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
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
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
app.use(express.static('public'));

// Routes
app.use("/posts", PostsRouter);
app.use("/posts", CommentRouter);
app.use("/account", SignUpRouter);
app.use("/", fileRouter);
app.use("/users", userRouter);
app.use("/preference", preferenceRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});