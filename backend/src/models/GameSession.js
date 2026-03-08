const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChildProfile',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  pieces: {
    type: Number,
    required: true
  },
  timeCompleted: {
    type: Number,
    required: true
  },
  tryAgainCount: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  mouseData: {
    avgSpeed: Number,
    totalPathLength: Number,
    totalPoints: Number,
    speedVariance: Number,
    pathEfficiency: Number,
    mousePath: [{
      x: Number,
      y: Number,
      timestamp: Number
    }]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

gameSessionSchema.index({ childId: 1, date: -1 });
gameSessionSchema.index({ parentId: 1, date: -1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);