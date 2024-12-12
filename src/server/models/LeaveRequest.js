const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Full Day', 'Half Day', 'RH', 'Compensatory Off'], 
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  takenOn: {
    type: Date,
    default: Date.now
  },
  SAPID: {
    type: String,
    required: true,
    ref: 'Employee',
    validate: {
      validator: function(v) {
        return /^\d{8}$/.test(v);
      },
      message: props => `${props.value} is not a valid SAP ID!`
    }
  },
  reason: {
    type: String,
    trim: true
  },
  cancel: {
    type: String,
    default: "0"
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', LeaveRequestSchema);