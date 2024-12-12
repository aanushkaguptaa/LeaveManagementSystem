const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    SAPID: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{8}$/, 'Please enter a valid 8-digit SAPID']
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    fullday: {
      type: Number,
      default: 0
    },
    halfday: {
      type: Number,
      default: 0
    },
    rh: {
      type: Number,
      default: 0
    },
    compOff: {
      type: Number,
      default: 0
    }
  }, {
    timestamps: true
  });

// Check if the model exists before compiling it
module.exports = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);