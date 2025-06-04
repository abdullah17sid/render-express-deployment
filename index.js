const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

let tasks = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("list", { tasks });
});

app.post("/add", (req, res) => {
  const { task, priority } = req.body;
  if (!task.trim()) {
    return res.send("<script>alert('Task cannot be empty'); window.location.href='/'</script>");
  }
  tasks.push({ id: Date.now(), name: task, priority });
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = parseInt(req.body.id);
  tasks = tasks.filter(task => task.id !== id);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const { id, task, priority } = req.body;
  tasks = tasks.map(t => t.id == id ? { ...t, name: task, priority } : t);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
