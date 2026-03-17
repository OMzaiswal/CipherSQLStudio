const mongoose = require("mongoose");

const SandboxSessionSchema = new mongoose.Schema({
  schema: { type: String, required: true, unique: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastUsedAt: { type: Date, default: Date.now },
});

// Index for fast queries on lastUsedAt during cleanup
SandboxSessionSchema.index({ lastUsedAt: 1 });

module.exports = mongoose.model("SandboxSession", SandboxSessionSchema);