const mongoose = require("mongoose");

const productDB = process.env.MONGO_CONNECTION;

mongoose.connect(userDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// userDB schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// userDB object
const User = mongoose.model("user", userSchema);

module.exports = User;