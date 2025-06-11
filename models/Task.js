const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'low'],
    default: 'low'
  }
});

module.exports = mongoose.model("Task", taskSchema);
