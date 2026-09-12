import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  title: { type: String },
  items: [{ type: String }],
  primaryButtonText: { type: String },
  primaryAction: { type: String },
  secondaryButtonText: { type: String },
  secondaryAction: { type: String }
});

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sender: { type: String, enum: ['ai', 'user'], required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true },
  card: cardSchema
});

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema]
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);
