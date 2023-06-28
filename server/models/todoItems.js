// import mongoose to create mongoose model
const mongoose = require('mongoose');

// create Schema
const TodoItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
});

// export this Schema
module.exports = mongoose.model('todo', TodoItemSchema);
