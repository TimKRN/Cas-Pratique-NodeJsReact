const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isDone: { type: Boolean, required:true }
});

module.exports = mongoose.model('todo', todoSchema);