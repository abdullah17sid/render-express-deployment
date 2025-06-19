const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Show all tasks
app.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.render("index", { tasks, alert: null });
});

// Add task
app.post("/add", async (req, res) => {
  const { title, priority } = req.body;
  if (!title.trim()) {
    const tasks = await Task.find();
    return res.render("index", { tasks, alert: "⚠️ Title cannot be empty!" });
  }

  await new Task({ title, priority }).save();
  const tasks = await Task.find();
  res.render("index", { tasks, alert: "✅ Task added successfully!" });
});

// Delete task
app.delete("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  const tasks = await Task.find();
  res.render("index", { tasks, alert: "🗑️ Task deleted successfully!" });
});

// Edit task
app.put("/edit/:id", async (req, res) => {
  const { updatedTitle, updatedPriority } = req.body;

  if (!updatedTitle.trim()) {
    const tasks = await Task.find();
    return res.render("index", { tasks, alert: "⚠️ Title cannot be empty!" });
  }

  await Task.findByIdAndUpdate(req.params.id, {
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
