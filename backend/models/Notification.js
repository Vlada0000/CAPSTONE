import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'trip_invite',
        'trip_accepted',
        'trip_declined',
        'trip_updated',
        'trip_deleted',
        'participant_removed',
        'itinerary_added',
        'itinerary_updated',
        'itinerary_deleted',
        'expense_added',
        'expense_updated',
        'expense_deleted',
        'new_message',
      ],
      required: true,
    },
    message: { type: String, required: true },
    data: { type: Object },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'notifiche',
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
