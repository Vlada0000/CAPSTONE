import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
      },
    ],
    photoUrl: { type: String },
  },
  {
    timestamps: true,
    collection: 'viaggi',
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
