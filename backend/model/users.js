const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
firstName: {
    type: String,
    required: [true, "Please enter your first name"]
},
lastName: {
    type: String,
    required: [true, "Please enter your last name"]
},
email: {
    type: String,
    required: [true, "Please add your email"],
    unique: true
},
password: {
    type: String,
    required: [true, "Please enter your password"]
},
role: {
    type: String,
    required: [true, "Please enter the user role"],
    enum: ['candidate', 'admin', 'superadmin'],
  },
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
