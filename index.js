const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Show all tasks
app.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.render("index", { tasks, alert: null });
});

// Add a new task
app.post("/add", async (req, res) => {
  const { title, priority } = req.body;

  if (!title.trim()) {
    const tasks = await Task.find();
    return res.render("index", { tasks, alert: "Task title cannot be empty!" });
  }

  const newTask = new Task({ title, priority });
  await newTask.save();
  const tasks = await Task.find();
  res.render("index", { tasks, alert: "✅ Task added successfully!" });
});

// Delete a task
app.post("/delete/:id", async (req, res) => {
  const taskId = req.params.id;
  await Task.findByIdAndDelete(taskId);
  const tasks = await Task.find();
  res.render("index", { tasks, alert: "🗑️ Task deleted successfully!" });
});

// Update a task
app.post("/edit/:id", async (req, res) => {
  const taskId = req.params.id;
  const { updatedTitle, updatedPriority } = req.body;

  if (!updatedTitle.trim()) {
    const tasks = await Task.find();
    return res.render("index", { tasks, alert: "⚠️ Title cannot be empty!" });
  }

  await Task.findByIdAndUpdate(taskId, {
    title: updatedTitle,
    priority: updatedPriority,
  });

  const tasks = await Task.find();
  res.render("index", { tasks, alert: "✏️ Task updated successfully!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
