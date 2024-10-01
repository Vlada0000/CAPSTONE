import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: 'messaggi',
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
